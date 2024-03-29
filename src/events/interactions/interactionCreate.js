const { getSettings } = require('@schemas/Guild');
const { contextHandler, statsHandler } = require('@src/handlers');

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').BaseInteraction} interaction
 */
module.exports = async (client, interaction) => {
	if (!interaction.guild) {
		return interaction
			.reply({ content: 'Command can only be executed in a discord server', ephemeral: true })
			.catch(() => {});
	}

	// Context Menu
	else if (interaction.isContextMenuCommand()) {
		const context = client.contextMenus.get(interaction.commandName);
		if (context) await contextHandler.handleContext(interaction, context);
		else return interaction.reply({ content: 'An error has occurred', ephemeral: true }).catch(() => {});
	}

	const settings = await getSettings(interaction.guild);

	// track stats
	if (settings.stats.enabled) statsHandler.trackInteractionStats(interaction).catch(() => {});
};
