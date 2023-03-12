/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'info',
	description: 'displays info commands',
	category: 'INFORMATION',
	command: {
		enabled: true,
	},

	async messageRun(message, args) {
		await message.safeReply(`codehere`);
	},

	async interactionRun(interaction) {
		await interaction.followUp(`codehere`);
	},
};
