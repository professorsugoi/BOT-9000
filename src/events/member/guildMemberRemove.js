const { inviteHandler, greetingHandler } = require('@src/handlers');

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember|import('discord.js').PartialGuildMember} member
 */
module.exports = async (member) => {
	if (member.partial) await member.user.fetch();
	if (!member.guild) return;

	const { guild } = member;

	// Invite Tracker
	const inviterData = await inviteHandler.trackLeftMember(guild, member.user);

	// Farewell message
	greetingHandler.sendFarewell(member, inviterData);
};

