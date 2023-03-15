const { commandHandler, automodHandler, statsHandler } = require('@src/handlers');
const { getSettings } = require('@schemas/Guild');

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const settings = await getSettings(message.guild);

	// command handler
	let isCommand = false;
	// check for bot mentions
	if (message.content.includes(`${client.user.id}`)) {
		message.channel.safeSend(`> My prefix is \`${settings.prefix}\`. Use \`/help\` for a list of commands.`);
	}

	if (message.content && message.content.startsWith(settings.prefix)) {
		const invoke = message.content.replace(`${settings.prefix}`, '').split(/\s+/)[0];
		const cmd = client.getCommand(invoke);
		if (cmd) {
			isCommand = true;
			commandHandler.handlePrefixCommand(message, cmd, settings);
		} else if (invoke.length > 0) {
			// If the command does not exist and has at least one character following the prefix, send the error response
			message.channel.safeSend(
				`\`!${invoke}\` is not a valid command.\n Use \`!help\` for a list of available commands.`
			);
		}
	}

	// stats handler
	if (settings.stats.enabled) await statsHandler.trackMessageStats(message, isCommand, settings);

	// if not a command
	if (!isCommand) await automodHandler.performAutomod(message, settings);
};

