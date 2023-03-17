const { getEffectiveInvites } = require('@handlers/invite');
const { EMBED_COLORS } = require('@root/config.js');
const { EmbedBuilder } = require('discord.js');
const { stripIndent } = require('common-tags');
const { getMember } = require('@schemas/Member');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'inviter',
	description: 'shows inviter information',
	category: 'STATS',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '[@member|id]',
	},

	async messageRun(message, args, data) {
		const target = (await message.guild.resolveMember(args[0])) || message.member;
		const response = await getInviter(message, target.user, data.settings);
		await message.safeReply(response);
	},
};

async function getInviter({ guild }, user, settings) {
	if (!settings.invite.tracking) return `Invite tracking is disabled in this server`;

	const inviteData = (await getMember(guild.id, user.id)).invite_data;
	if (!inviteData || !inviteData.inviter) return `Cannot track how \`${user.tag}\` joined`;

	const inviter = await guild.client.users.fetch(inviteData.inviter, false, true);
	const inviterData = (await getMember(guild.id, inviteData.inviter)).invite_data;

	const inviteNames = {
		yUTegA5p9R: 'Twitter',
		hijklmno: 'Facebook',
		// Add more mappings as needed
	};

	const inviteName = inviteNames[inviteData.code] || inviteData.code;

	const embed = new EmbedBuilder()
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setAuthor({ name: `Invite data for ${user.username}` })
		.setDescription(
			stripIndent`
      Inviter: \`${inviter?.tag || 'Deleted User'}\`
      Inviter ID: \`${inviteData.inviter}\`
      Invite Code: \`${inviteName}\`
      Inviter Invites: \`${getEffectiveInvites(inviterData)}\`
      `
		);

	return { embeds: [embed] };
}
