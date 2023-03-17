const { buildGreeting } = require('@handlers/greeting');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'welcome',
	description: 'setup welcome message',
	category: 'ADMIN',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		minArgsCount: 1,
		subcommands: [
			{
				trigger: 'status <on|off>',
				description: 'enable or disable welcome message',
			},
			{
				trigger: 'channel <#channel>',
				description: 'configure welcome message channel',
			},
			{
				trigger: 'preview',
				description: 'preview the configured welcome message',
			},
			{
				trigger: 'msg <text>',
				description: 'set welcome message',
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

		// msg
		else if (type === 'msg') {
			if (args.length < 2) return message.safeReply('Insufficient arguments! Please provide valid content');
			const msg = args.slice(1).join(' ');
			response = await setWelcomeMessage(settings, msg);
		}

		//
		else response = 'Invalid command usage!';
		return message.safeReply(response);
	},
};

async function sendPreview(settings, member) {
	if (!settings.welcome?.enabled) return 'Welcome message not enabled in this server';

	const targetChannel = member.guild.channels.cache.get(settings.welcome.channel);
	if (!targetChannel) return 'No channel is configured to send welcome message';

	const response = await buildGreeting(member, 'WELCOME', settings.welcome);
	await targetChannel.safeSend(response);

	return `Sent welcome preview to ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
	const enabled = status.toUpperCase() === 'ON' ? true : false;
	settings.welcome.enabled = enabled;
	await settings.save();
	return `Configuration saved! Welcome message ${enabled ? 'enabled' : 'disabled'}`;
}

async function setChannel(settings, channel) {
	if (!channel.canSendEmbeds()) {
		return (
			'Ugh! I cannot send greeting to that channel? I need the `Write Messages` and `Embed Links` permissions in ' +
			channel.toString()
		);
	}
	settings.welcome.channel = channel.id;
	await settings.save();
	return `Configuration saved! Welcome message will be sent to ${channel ? channel.toString() : 'Not found'}`;
}

async function setWelcomeMessage(settings, msg) {
	settings.welcome.welcomeMessage = msg;
	await settings.save();
	return 'Configuration saved! Welcome message updated';
}

