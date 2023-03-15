const { EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'avatar',
	description: 'shows a users avatar in higher resolution',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		aliases: ['pfp', 'icon'],
		usage: '<user>',
	},

	async messageRun(message, args) {
		const target = (await message.guild.resolveMember(args[0])) || message.member;
		const response = getAvatar(target.user);
		await message.safeReply(response);
	},
};

function getAvatar(user) {
	const x256 = user.displayAvatarURL({ extension: 'png', size: 256 });
	const x1024 = user.displayAvatarURL({ extension: 'png', size: 1024 });

	const embed = new EmbedBuilder()
		.setTitle(`Avatar of ${user.username}`)
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setImage(x256)
		.setDescription(`URL: • [x1024](${x1024})`);

	return {
		embeds: [embed],
	};
}

