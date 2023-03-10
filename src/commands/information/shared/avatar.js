const { EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');

/**
 * @param {import('discord.js').User} user
 */
module.exports = (user) => {
	const x256 = user.displayAvatarURL({ extension: 'png', size: 256 });

	const embed = new EmbedBuilder().setTitle(`${user.username}`).setColor(EMBED_COLORS.BOT_EMBED).setImage(x256);

	return {
		embeds: [embed],
	};
};

