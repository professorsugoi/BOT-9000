const { EmbedBuilder, ChannelType } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');
const { stripIndent } = require('common-tags');
const channelTypes = require('@helpers/channelTypes');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'channelinfo',
	description: 'shows information about a channel',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '[#channel|id]',
		aliases: ['chinfo'],
	},

	async messageRun(message, args) {
		let targetChannel;

		if (message.mentions.channels.size > 0) {
			targetChannel = message.mentions.channels.first();
		}

		// find channel by name/ID
		else if (args.length > 0) {
			const search = args.join(' ');
			const tcByName = message.guild.findMatchingChannels(search);
			if (tcByName.length === 0) return message.safeReply(`No channels found matching \`${search}\`!`);
			if (tcByName.length > 1) return message.safeReply(`Multiple channels found matching \`${search}\`!`);
			[targetChannel] = tcByName;
		} else {
			targetChannel = message.channel;
		}

		const response = channelInfo(targetChannel);
		await message.safeReply(response);
	},
};

/**
 * @param {import('discord.js').GuildChannel} channel
 */
module.exports = (channel) => {
	const { id, name, parent, position, type } = channel;

	let desc = stripIndent`
      ▷ ID: **${id}**
      ▷ Name: **${name}**
      ▷ Type: **${channelTypes(channel.type)}**
      ▷ Category: **${parent || 'NA'}**\n
      `;

	if (type === ChannelType.GuildText) {
		const { rateLimitPerUser, nsfw } = channel;
		desc += stripIndent`
      ▷ Topic: **${channel.topic || 'No topic set'}**
      ▷ Position: **${position}**
      ▷ Slowmode: **${rateLimitPerUser}**
      ▷ isNSFW: **${nsfw ? '✓' : '✕'}**\n
      `;
	}

	if (type === ChannelType.PublicThread || type === ChannelType.PrivateThread) {
		const { ownerId, archived, locked } = channel;
		desc += stripIndent`
      ▷ Owner Id: **${ownerId}**
      ▷ Is Archived: **${archived ? '✓' : '✕'}**
      ▷ Is Locked: **${locked ? '✓' : '✕'}**\n
      `;
	}

	if (type === ChannelType.News || type === ChannelType.NewsThread) {
		const { nsfw } = channel;
		desc += stripIndent`
      ▷ isNSFW: **${nsfw ? '✓' : '✕'}**\n
      `;
	}

	if (type === ChannelType.GuildVoice || type === ChannelType.GuildStageVoice) {
		const { bitrate, userLimit, full } = channel;
		desc += stripIndent`
      ▷ Position: **${position}**
      ▷ Bitrate: **${bitrate}**
      ▷ User Limit: **${userLimit}**
      ▷ isFull: **${full ? '✓' : '✕'}**\n
      `;
	}

	const embed = new EmbedBuilder()
		.setAuthor({ name: 'Channel Details' })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setDescription(desc);

	return { embeds: [embed] };
};

