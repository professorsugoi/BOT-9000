const { canModerate } = require('@helpers/ModUtils');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'nick',
	description: 'nickname commands',
	category: 'MODERATION',
	botPermissions: ['ManageNicknames'],
	userPermissions: ['ManageNicknames'],
	command: {
		enabled: true,
		minArgsCount: 2,
		subcommands: [
			{
				trigger: 'set <@member> <name>',
				description: 'sets the nickname of the specified member',
			},
			{
				trigger: 'reset <@member>',
				description: 'reset a members nickname',
			},
		],
	},

	async messageRun(message, args) {
		const sub = args[0].toLowerCase();

		if (sub === 'set') {
			const target = await message.guild.resolveMember(args[1]);
			if (!target) return message.safeReply('Could not find matching member');
			const name = args.slice(2).join(' ');
			if (!name) return message.safeReply('Please specify a nickname');

			const response = await nickname(message, target, name);
			return message.safeReply(response);
		}

		//
		else if (sub === 'reset') {
			const target = await message.guild.resolveMember(args[1]);
			if (!target) return message.safeReply('Could not find matching member');

			const response = await nickname(message, target);
			return message.safeReply(response);
		}
	},
};

async function nickname({ member, guild }, target, name) {
	if (!canModerate(member, target)) {
		return `Oops! You cannot manage nickname of ${target.user.tag}`;
	}
	if (!canModerate(guild.members.me, target)) {
		return `Oops! I cannot manage nickname of ${target.user.tag}`;
	}

	try {
		await target.setNickname(name);
		return `Successfully ${name ? 'changed' : 'reset'} nickname of ${target.user.tag}`;
	} catch (ex) {
		return `Failed to ${name ? 'change' : 'reset'} nickname for ${target.displayName}. Did you provide a valid name?`;
	}
}

