const { greetingHandler } = require('@src/handlers');
const { getSettings } = require('@schemas/Guild');

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (member) => {
	if (!member || !member.guild) return;

	const { guild } = member;
	const settings = await getSettings(guild);

	// Autorole
	if (settings.autorole) {
		const role = guild.roles.cache.get(settings.autorole);
		if (role) member.roles.add(role).catch((err) => {});
	}

	// Send welcome message
	greetingHandler.sendWelcome(member);
};
