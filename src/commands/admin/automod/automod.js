const { EmbedBuilder } = require('discord.js');
const { EMBED_COLORS } = require('@root/config.js');
const { stripIndent } = require('common-tags');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'automod',
	description: 'various automod configurations',
	category: 'AUTOMOD',
	userPermissions: ['ManageGuild'],
	command: {
		enabled: true,
		minArgsCount: 1,
		subcommands: [
			{
				trigger: 'status',
				description: 'check automod configuration for this guild',
			},
			{
				trigger: 'strikes <number>',
				description: 'maximum number of strikes a user can receive before taking an action',
			},
			{
				trigger: 'action <TIMEOUT|KICK|BAN>',
				description: 'set action to be performed after receiving maxiumum number of strikes',
			},
			{
				trigger: 'debug <on|off>',
				description: 'toggle ON to have automod no longer ignore members with mod/admin perms',
			},
			{
				trigger: 'whitelist',
				description: 'get list of whitelisted channels',
			},
			{
				trigger: 'whitelistadd <channel>',
				description: 'add a channel to the whitelist',
			},
			{
				trigger: 'whitelistremove <channel>',
				description: 'remove a channel from the whitelist',
			},
		],
	},

	async messageRun(message, args, data) {
		const input = args[0].toLowerCase();
		const settings = data.settings;

		// status
		let response;
		if (input === 'status') {
			response = await getStatus(settings, message.guild);

			// strikees
		} else if (input === 'strikes') {
			const strikes = args[1];
			if (isNaN(strikes) || Number.parseInt(strikes) < 1) {
				return message.safeReply('Strikes must be a valid number greater than 0');
			}
			response = await setStrikes(settings, strikes);

			// action
		} else if (input === 'action') {
			const action = args[1].toUpperCase();
			if (!action || !['TIMEOUT', 'KICK', 'BAN'].includes(action))
				return message.safeReply('Not a valid action. Action can be `Timeout`/`Kick`/`Ban`');
			response = await setAction(settings, message.guild, action);

			// debug
		} else if (input === 'debug') {
			const status = args[1].toLowerCase();
			if (!['on', 'off'].includes(status)) return message.safeReply('Invalid status. Value must be `on/off`');
			response = await setDebug(settings, status);
		}

		// whitelist
		else if (input === 'whitelist') {
			response = getWhitelist(message.guild, settings);
		}

		// whitelist add
		else if (input === 'whitelistadd') {
			const match = message.guild.findMatchingChannels(args[1]);
			if (!match.length) return message.safeReply(`No channel found matching ${args[1]}`);
			response = await whiteListAdd(settings, match[0].id);
		}

		// whitelist remove
		else if (input === 'whitelistremove') {
			const match = message.guild.findMatchingChannels(args[1]);
			if (!match.length) return message.safeReply(`No channel found matching ${args[1]}`);
			response = await whiteListRemove(settings, match[0].id);
		}

		//
		else response = 'Invalid command usage!';
		await message.safeReply(response);
	},

	async interactionRun(interaction, data) {
		const sub = interaction.options.getSubcommand();
		const settings = data.settings;

		let response;

		if (sub === 'status') response = await getStatus(settings, interaction.guild);
		else if (sub === 'strikes') response = await setStrikes(settings, interaction.options.getInteger('amount'));
		else if (sub === 'action')
			response = await setAction(settings, interaction.guild, interaction.options.getString('action'));
		else if (sub === 'debug') response = await setDebug(settings, interaction.options.getString('status'));
		else if (sub === 'whitelist') {
			response = getWhitelist(interaction.guild, settings);
		} else if (sub === 'whitelistadd') {
			const channelId = interaction.options.getChannel('channel').id;
			response = await whiteListAdd(settings, channelId);
		} else if (sub === 'whitelistremove') {
			const channelId = interaction.options.getChannel('channel').id;
			response = await whiteListRemove(settings, channelId);
		}

		await interaction.followUp(response);
	},
};

async function getStatus(settings, guild) {
	const { automod } = settings;

	const logChannel = settings.modlog_channel
		? guild.channels.cache.get(settings.modlog_channel).toString()
		: 'Not Configured';

	// String Builder
	let desc = stripIndent`
    ▷ **Max Lines**: ${automod.max_lines || 'NA'}
    ▷ **Anti-Massmention**: ${automod.anti_massmention > 0 ? '✓' : '✕'}
    ▷ **Anti-Attachment**: ${automod.anti_attachment ? '✓' : '✕'}
    ▷ **Anti-Links**: ${automod.anti_links ? '✓' : '✕'}
    ▷ **Anti-Invites**: ${automod.anti_invites ? '✓' : '✕'}
    ▷ **Anti-Spam**: ${automod.anti_spam ? '✓' : '✕'}
    ▷ **Anti-Ghostping**: ${automod.anti_ghostping ? '✓' : '✕'}
  `;

	const embed = new EmbedBuilder()
		.setAuthor({ name: 'Automod Configuration', iconURL: guild.iconURL() })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setDescription(desc)
		.addFields(
			{
				name: 'Log Channel',
				value: logChannel,
				inline: true,
			},
			{
				name: 'Max Strikes',
				value: automod.strikes.toString(),
				inline: true,
			},
			{
				name: 'Action',
				value: automod.action,
				inline: true,
			},
			{
				name: 'Debug',
				value: automod.debug ? '✓' : '✕',
				inline: true,
			}
		);

	return { embeds: [embed] };
}

async function setStrikes(settings, strikes) {
	settings.automod.strikes = strikes;
	await settings.save();
	return `Configuration saved! Maximum strikes is set to ${strikes}`;
}

async function setAction(settings, guild, action) {
	if (action === 'TIMEOUT') {
		if (!guild.members.me.permissions.has('ModerateMembers')) {
			return 'I do not have permission to timeout members';
		}
	}

	if (action === 'KICK') {
		if (!guild.members.me.permissions.has('KickMembers')) {
			return 'I do not have permission to kick members';
		}
	}

	if (action === 'BAN') {
		if (!guild.members.me.permissions.has('BanMembers')) {
			return 'I do not have permission to ban members';
		}
	}

	settings.automod.action = action;
	await settings.save();
	return `Configuration saved! Automod action is set to ${action}`;
}

async function setDebug(settings, input) {
	const status = input.toLowerCase() === 'on' ? true : false;
	settings.automod.debug = status;
	await settings.save();
	return `Configuration saved! Automod debug is now ${status ? 'enabled' : 'disabled'}`;
}

function getWhitelist(guild, settings) {
	const whitelist = settings.automod.wh_channels;
	if (!whitelist || !whitelist.length) return 'No channels are whitelisted';

	const channels = [];
	for (const channelId of whitelist) {
		const channel = guild.channels.cache.get(channelId);
		if (!channel) continue;
		if (channel) channels.push(channel.toString());
	}

	return `Whitelisted channels: ${channels.join(', ')}`;
}

async function whiteListAdd(settings, channelId) {
	if (settings.automod.wh_channels.includes(channelId)) return 'Channel is already whitelisted';
	settings.automod.wh_channels.push(channelId);
	await settings.save();
	return `Channel whitelisted!`;
}

async function whiteListRemove(settings, channelId) {
	if (!settings.automod.wh_channels.includes(channelId)) return 'Channel is not whitelisted';
	settings.automod.wh_channels.splice(settings.automod.wh_channels.indexOf(channelId), 1);
	await settings.save();
	return `Channel removed from whitelist!`;
}
