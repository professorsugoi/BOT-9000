const { EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'avatar',
	description: 'shows a users avatar information',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '[@member|id]',
	},

	async messageRun(message, args) {
		const target = (await message.guild.resolveMember(args[0])) || message.member;
		const response = avatarInfo(target.user);
		await message.safeReply(response);
	},
};

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

