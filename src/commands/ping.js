/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'ping',
	description: 'Shows current ping from the bot to server',
	category: 'INFORMATION',
	command: {
		enabled: true,
		usage: '',
	},

	async messageRun(message) {
		await message.safeReply(`🏓 Pong : \`${Math.floor(message.client.ws.ping)}ms\``);
	},
};

