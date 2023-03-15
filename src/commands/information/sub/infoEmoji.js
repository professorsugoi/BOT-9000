const { parseEmoji, EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'emojiinfo',
	description: 'shows info about an emoji',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '<emoji>',
		minArgsCount: 1,
	},

	async messageRun(message, args) {
		const emoji = args[0];
		const response = emojiInfo(emoji);
		await message.safeReply(response);
	},
};

module.exports = (emoji) => {
	let custom = parseEmoji(emoji);
	if (!custom.id) return 'This is not a valid guild emoji';

	let url = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif?v=1' : 'png'}`;

	const embed = new EmbedBuilder()
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setAuthor({ name: 'Emoji Info' })
		.setDescription(
			`**Id:** ${custom.id}\n` + `**Name:** ${custom.name}\n` + `**Animated:** ${custom.animated ? 'Yes' : 'No'}`
		)
		.setImage(url);

	return { embeds: [embed] };
};

