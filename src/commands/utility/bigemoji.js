const { parseEmoji, EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config.js');
const { parse } = require('twemoji-parser');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'bigemoji',
	description: 'Enlarge an emoji',
	category: 'UTILITY',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '<emoji>',
		aliases: ['enlarge'],
		minArgsCount: 1,
	},

	async messageRun(message, args) {
		const emoji = args[0];
		const response = getEmoji(message.author, emoji);
		await message.safeReply(response);
	},
};

function getEmoji(user, emoji) {
	const custom = parseEmoji(emoji);

	const embed = new EmbedBuilder()
		.setAuthor({ name: '▷ Big Emoji ❮' })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setFooter({ text: `Requested by ${user.tag}` });

	if (custom.id) {
		embed.setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png'}`);
		return { embeds: [embed] };
	}
	const parsed = parse(emoji, { assetType: 'png' });
	if (!parsed[0]) return 'Not a valid emoji';

	embed.setImage(parsed[0].url);
	return { embeds: [embed] };
}

