const { timeoutTarget } = require('@helpers/ModUtils');
const ems = require('enhanced-ms');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'timeout',
	description: 'timeouts the specified member',
	category: 'MODERATION',
	botPermissions: ['ModerateMembers'],
	userPermissions: ['ModerateMembers'],
	command: {
		enabled: true,
		aliases: ['mute'],
		usage: '<ID|@member> <duration> [reason]',
		minArgsCount: 2,
	},

	async messageRun(message, args) {
		const target = await message.guild.resolveMember(args[0], true);
		if (!target) return message.safeReply(`No user found matching ${args[0]}`);

		// parse time
		const ms = ems(args[1]);
		if (!ms) return message.safeReply('Please provide a valid duration. Example: 1d/1h/1m/1s');

		const reason = args.slice(2).join(' ').trim();
		const response = await timeout(message.member, target, ms, reason);
		await message.safeReply(response);
	},
};

async function timeout(issuer, target, ms, reason) {
	if (isNaN(ms)) return 'Please provide a valid duration. Example: 1d/1h/1m/1s';
	const response = await timeoutTarget(issuer, target, ms, reason);
	if (typeof response === 'boolean') return `${target.user.tag} is timed out!`;
	if (response === 'BOT_PERM') return `I do not have permission to timeout ${target.user.tag}`;
	else if (response === 'MEMBER_PERM') return `You do not have permission to timeout ${target.user.tag}`;
	else if (response === 'ALREADY_TIMEOUT') return `${target.user.tag} is already timed out!`;
	else return `Failed to timeout ${target.user.tag}`;
}

