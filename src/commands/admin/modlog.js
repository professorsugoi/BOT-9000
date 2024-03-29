// update to show current config when using no args

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'modlog',
	description: 'enable or disable moderation logs',
	category: 'ADMIN',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		usage: '<#channel|off>',
		minArgsCount: 1,
	},

	async messageRun(message, args, data) {
		const input = args[0].toLowerCase();
		let targetChannel;

		if (input === 'none' || input === 'off' || input === 'disable') targetChannel = null;
		else {
			if (message.mentions.channels.size === 0) return message.safeReply('Incorrect command usage');
			targetChannel = message.mentions.channels.first();
		}

		const response = await setChannel(targetChannel, data.settings);
		return message.safeReply(response);
	},
};

async function setChannel(targetChannel, settings) {
	if (targetChannel && !targetChannel.canSendEmbeds()) {
		return 'Ugh! I cannot send logs to that channel? I need the `Write Messages` and `Embed Links` permissions in that channel';
	}

	settings.modlog_channel = targetChannel?.id;
	await settings.save();
	return `Configuration saved! Modlog channel ${targetChannel ? 'updated' : 'removed'}`;
}

