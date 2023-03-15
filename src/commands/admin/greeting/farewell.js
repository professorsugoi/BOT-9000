const { isHex } = require('@helpers/Utils');
const { buildGreeting } = require('@handlers/greeting');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'farewell',
	description: 'setup farewell message',
	category: 'ADMIN',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		minArgsCount: 1,
		subcommands: [
			{
				trigger: 'status <on|off>',
				description: 'enable or disable farewell message',
			},
			{
				trigger: 'channel <#channel>',
				description: 'configure farewell message',
			},
			{
				trigger: 'preview',
				description: 'preview the configured farewell message',
			},
			{
				trigger: 'desc <text>',
				description: 'set embed description',
			},
			{
				trigger: 'thumbnail <ON|OFF>',
				description: 'enable/disable embed thumbnail',
			},
			{
				trigger: 'color <hexcolor>',
				description: 'set embed color',
			},
			{
				trigger: 'footer <text>',
				description: 'set embed footer content',
			},
			{
				trigger: 'image <url>',
				description: 'set embed image',
			},
		],
	},

	async messageRun(message, args, data) {
		const type = args[0].toLowerCase();
		const settings = data.settings;
		let response;

		// preview
		if (type === 'preview') {
			response = await sendPreview(settings, message.member);
		}

		// status
		else if (type === 'status') {
			const status = args[1]?.toUpperCase();
			if (!status || !['ON', 'OFF'].includes(status))
				return message.safeReply('Invalid status. Value must be `on/off`');
			response = await setStatus(settings, status);
		}

		// channel
		else if (type === 'channel') {
			const channel = message.mentions.channels.first();
			response = await setChannel(settings, channel);
		}

		// desc
		else if (type === 'desc') {
			if (args.length < 2) return message.safeReply('Insufficient arguments! Please provide valid content');
			const desc = args.slice(1).join(' ');
			response = await setDescription(settings, desc);
		}

		// thumbnail
		else if (type === 'thumbnail') {
			const status = args[1]?.toUpperCase();
			if (!status || !['ON', 'OFF'].includes(status))
				return message.safeReply('Invalid status. Value must be `on/off`');
			response = await setThumbnail(settings, status);
		}

		// color
		else if (type === 'color') {
			const color = args[1];
			if (!color || !isHex(color)) return message.safeReply('Invalid color. Value must be a valid hex color');
			response = await setColor(settings, color);
		}

		// footer
		else if (type === 'footer') {
			if (args.length < 2) return message.safeReply('Insufficient arguments! Please provide valid content');
			const content = args.slice(1).join(' ');
			response = await setFooter(settings, content);
		}

		// image
		else if (type === 'image') {
			const url = args[1];
			if (!url) return message.safeReply('Invalid image url. Please provide a valid url');
			response = await setImage(settings, url);
		}

		//
		else response = 'Invalid command usage!';
		return message.safeReply(response);
	},
};

async function sendPreview(settings, member) {
	if (!settings.farewell?.enabled) return 'Farewell message not enabled in this server';

	const targetChannel = member.guild.channels.cache.get(settings.farewell.channel);
	if (!targetChannel) return 'No channel is configured to send farewell message';

	const response = await buildGreeting(member, 'FAREWELL', settings.farewell);
	await targetChannel.safeSend(response);

	return `Sent farewell preview to ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
	const enabled = status.toUpperCase() === 'ON' ? true : false;
	settings.farewell.enabled = enabled;
	await settings.save();
	return `Configuration saved! Farewell message ${status ? 'enabled' : 'disabled'}`;
}

async function setChannel(settings, channel) {
	if (!channel.canSendEmbeds()) {
		return (
			'Ugh! I cannot send greeting to that channel? I need the `Write Messages` and `Embed Links` permissions in ' +
			channel.toString()
		);
	}
	settings.farewell.channel = channel.id;
	await settings.save();
	return `Configuration saved! Farewell message will be sent to ${channel ? channel.toString() : 'Not found'}`;
}

async function setDescription(settings, desc) {
	settings.farewell.embed.description = desc;
	await settings.save();
	return 'Configuration saved! Farewell message updated';
}

async function setThumbnail(settings, status) {
	settings.farewell.embed.thumbnail = status.toUpperCase() === 'ON' ? true : false;
	await settings.save();
	return 'Configuration saved! Farewell message updated';
}

async function setColor(settings, color) {
	settings.farewell.embed.color = color;
	await settings.save();
	return 'Configuration saved! Farewell message updated';
}

async function setFooter(settings, content) {
	settings.farewell.embed.footer = content;
	await settings.save();
	return 'Configuration saved! Farewell message updated';
}

async function setImage(settings, url) {
	settings.farewell.embed.image = url;
	await settings.save();
	return 'Configuration saved! Farewell message updated';
}

