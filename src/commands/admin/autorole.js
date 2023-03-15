/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'autorole',
	description: 'setup role to be given when a user joins the server',
	category: 'ADMIN',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		usage: '<role|off>',
		minArgsCount: 1,
	},

	async messageRun(message, args, data) {
		const input = args.join(' ');
		let response;

		if (input.toLowerCase() === 'off') {
			response = await setAutoRole(message, null, data.settings);
		} else {
			const roles = message.guild.findMatchingRoles(input);
			if (roles.length === 0) response = 'No matching roles found matching your query';
			else response = await setAutoRole(message, roles[0], data.settings);
		}

		await message.safeReply(response);
	},
};

/**
 * @param {import("discord.js").Message} message
 * @param {import("discord.js").Role} role
 * @param {import("@models/Guild")} settings
 */
async function setAutoRole({ guild }, role, settings) {
	if (role) {
		if (role.id === guild.roles.everyone.id) return 'You cannot set `@everyone` as the autorole';
		if (!guild.members.me.permissions.has('ManageRoles')) return "I don't have the `ManageRoles` permission";
		if (guild.members.me.roles.highest.position < role.position)
			return "I don't have the permissions to assign this role";
		if (role.managed) return 'Oops! This role is managed by an integration';
	}

	if (!role) settings.autorole = null;
	else settings.autorole = role.id;

	await settings.save();
	return `Configuration saved! Autorole is ${!role ? 'disabled' : 'setup'}`;
}

