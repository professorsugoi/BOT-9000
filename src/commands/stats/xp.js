/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'levelup',
	description: 'configure the levelling system',
	category: 'STATS',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		minArgsCount: 1,
		subcommands: [
			{
				trigger: 'message <new-message>',
				description: 'set custom level up message',
			},
			{
				trigger: 'channel <#channel|off>',
				description: 'set the channel to send level up messages to',
			},
		],
	},

	async messageRun(message, args, data) {
		const sub = args[0];
		const subcommandArgs = args.slice(1);
		let response;

		// message
		if (sub === 'message') {
			const message = subcommandArgs.join(' ');
			response = await setMessage(message, data.settings);
		}

		// channel
		else if (sub === 'channel') {
			const input = subcommandArgs[0];
			let channel;

			if (input === 'off') channel = 'off';
			else {
				const match = message.guild.findMatchingChannels(input);
				if (match.length === 0) return message.safeReply('Invalid channel. Please provide a valid channel');
				channel = match[0];
			}
			response = await setChannel(channel, data.settings);
		}

		// invalid
		else response = 'Invalid subcommand';
		await message.safeReply(response);
	},
};

async function setMessage(message, settings) {
	if (!message) return 'Invalid message. Please provide a message';
	settings.stats.xp.message = message;
	await settings.save();
	return `Configuration saved. Level up message updated!`;
}

async function setChannel(channel, settings) {
	if (!channel) return 'Invalid channel. Please provide a channel';

	if (channel === 'off') settings.stats.xp.channel = null;
	else settings.stats.xp.channel = channel.id;

	await settings.save();
	return `Configuration saved. Level up channel updated!`;
}

