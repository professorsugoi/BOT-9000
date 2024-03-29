const { banTarget } = require('@helpers/ModUtils');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'ban',
	description: 'Bans the specified member',
	category: 'MODERATION',
	botPermissions: ['BanMembers'],
	userPermissions: ['BanMembers'],
	command: {
		enabled: true,
		usage: '<ID|@member> [reason]',
		minArgsCount: 1,
	},

	async messageRun(message, args) {
		const match = await message.client.resolveUsers(args[0], true);
		const target = match[0];
		if (!target) return message.safeReply(`No user found matching ${args[0]}`);
		const reason = message.content.split(args[0])[1].trim();
		const response = await ban(message.member, target, reason);
		await message.safeReply(response);
	},
};

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {import('discord.js').User} target
 * @param {string} reason
 */
async function ban(issuer, target, reason) {
	const response = await banTarget(issuer, target, reason);
	if (typeof response === 'boolean') return `${target.tag} is banned!`;
	if (response === 'BOT_PERM') return `I do not have permission to ban ${target.tag}`;
	else if (response === 'MEMBER_PERM') return `You do not have permission to ban ${target.tag}`;
	else return `Failed to ban ${target.tag}`;
}

