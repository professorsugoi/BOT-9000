/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'statstracking',
	description: 'enable or disable tracking stats in the server',
	category: 'STATS',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		aliases: ['statssystem', 'statstracking'],
		usage: '<on|off>',
		minArgsCount: 1,
	},

	async messageRun(message, args, data) {
		const input = args[0].toLowerCase();
		if (!['on', 'off'].includes(input)) return message.safeReply('Invalid status. Value must be `on/off`');
		const response = await setStatus(input, data.settings);
		return message.safeReply(response);
	},
};

async function setStatus(input, settings) {
	const status = input.toLowerCase() === 'on' ? true : false;

	settings.stats.enabled = status;
	await settings.save();

	return `Configuration saved! Stats Tracking is now ${status ? 'enabled' : 'disabled'}`;
}

