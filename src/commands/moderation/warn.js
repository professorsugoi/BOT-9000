const { warnTarget } = require('@helpers/ModUtils');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'warn',
	description: 'warns the specified member',
	category: 'MODERATION',
	userPermissions: ['KickMembers'],
	command: {
		enabled: true,
		usage: '<ID|@member> [reason]',
		minArgsCount: 1,
	},

	async messageRun(message, args) {
		const target = await message.guild.resolveMember(args[0], true);
		if (!target) return message.safeReply(`No user found matching ${args[0]}`);
		const reason = message.content.split(args[0])[1].trim();
		const response = await warn(message.member, target, reason);
		await message.safeReply(response);
	},
};

async function warn(issuer, target, reason) {
	const response = await warnTarget(issuer, target, reason);
	if (typeof response === 'boolean') return `${target.user.tag} is warned!`;
	if (response === 'BOT_PERM') return `I do not have permission to warn ${target.user.tag}`;
	else if (response === 'MEMBER_PERM') return `You do not have permission to warn ${target.user.tag}`;
	else return `Failed to warn ${target.user.tag}`;
}

