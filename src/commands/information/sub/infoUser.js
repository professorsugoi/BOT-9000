const { EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');

/**
 * @param {import('discord.js').GuildMember} member
 */
module.exports = (member) => {
	let color = member.displayHexColor;
	if (color === '#000000') color = EMBED_COLORS.BOT_EMBED;

	let filteredRoles = member.roles.cache.filter((r) => r.name !== '@everyone');
	let rolesString = member.roles.cache
		.filter((r) => r.name !== '@everyone')
		.map((r) => r.toString())
		.join(' | ');
	if (rolesString.length > 1024) rolesString = rolesString.substring(0, 1020) + '...';

	const embed = new EmbedBuilder()
		.setAuthor({
			name: `USER INFO ☆`,
			iconURL: member.user.displayAvatarURL(),
		})
		.setThumbnail(member.user.displayAvatarURL())
		.setColor(color)
		.addFields(
			{
				name: 'Nickname',
				value: member.displayName,
				inline: true,
			},
			{
				name: 'Usertag',
				value: member.user.tag,
				inline: true,
			},
			{
				name: '\u200B',
				value: '\u200B',
				inline: true,
			},
			{
				name: 'Joined server',
				value: member.joinedAt.toLocaleDateString(),
				inline: true,
			},
			{
				name: 'Account created',
				value: member.user.createdAt.toLocaleDateString(),
				inline: true,
			},
			{
				name: '\u200B',
				value: '\u200B',
				inline: true,
			},
			{
				name: `Roles [${filteredRoles.size}]`,
				value: rolesString,
				inline: true,
			},
			{
				name: '---',
				value: 'use `!stats <user>` for ranking info',
			}
			// {
			// 	name: 'Avatar',
			// 	value: member.user.displayAvatarURL({ extension: 'png' }),
			// }
		)
		.setTimestamp(Date.now());

	return { embeds: [embed] };
};

