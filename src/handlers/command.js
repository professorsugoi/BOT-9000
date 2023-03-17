const { EmbedBuilder } = require('discord.js');
const { OWNER_IDS, PREFIX_COMMANDS, EMBED_COLORS } = require('@root/config');
const { parsePermissions } = require('@helpers/Utils');
const { timeformat } = require('@helpers/Utils');

const cooldownCache = new Map();

module.exports = {
	/**
	 * @param {import('discord.js').Message} message
	 * @param {import("@structures/Command")} cmd
	 * @param {object} settings
	 */
	handlePrefixCommand: async function (message, cmd, settings) {
		const prefix = settings.prefix;
		const args = message.content.replace(prefix, '').split(/\s+/);
		const invoke = args.shift().toLowerCase();

		const data = {};
		data.settings = settings;
		data.prefix = prefix;
		data.invoke = invoke;

		if (!message.channel.permissionsFor(message.guild.members.me).has('SendMessages')) return;

		// callback validations
		if (cmd.validations) {
			for (const validation of cmd.validations) {
				if (!validation.callback(message)) {
					return message.safeReply(validation.message);
				}
			}
		}

		// Owner commands
		if (cmd.category === 'OWNER' && !OWNER_IDS.includes(message.author.id)) {
			return message.safeReply('This command is only accessible to bot owners');
		}

		// check user permissions
		if (cmd.userPermissions && cmd.userPermissions?.length > 0) {
			if (!message.channel.permissionsFor(message.member).has(cmd.userPermissions)) {
				return message.safeReply(`You need ${parsePermissions(cmd.userPermissions)} for this command`);
			}
		}

		// check bot permissions
		if (cmd.botPermissions && cmd.botPermissions.length > 0) {
			if (!message.channel.permissionsFor(message.guild.members.me).has(cmd.botPermissions)) {
				return message.safeReply(`I need ${parsePermissions(cmd.botPermissions)} for this command`);
			}
		}

		// minArgs count
		if (cmd.command.minArgsCount > args.length) {
			const usageEmbed = this.getCommandUsage(cmd, prefix, invoke);
			return message.safeReply({ embeds: [usageEmbed] });
		}

		// cooldown check
		if (cmd.cooldown > 0) {
			const remaining = getRemainingCooldown(message.author.id, cmd);
			if (remaining > 0) {
				return message.safeReply(`You are on cooldown. You can again use the command in \`${timeformat(remaining)}\``);
			}
		}

		try {
			await cmd.messageRun(message, args, data);
		} catch (ex) {
			message.client.logger.error('messageRun', ex);
			message.safeReply('An error occurred while running this command');
		} finally {
			if (cmd.cooldown > 0) applyCooldown(message.author.id, cmd);
		}
	},
	/**
	 * Build a usage embed for this command
	 * @param {import('@structures/Command')} cmd - command object
	 * @param {string} prefix - guild bot prefix
	 * @param {string} invoke - alias that was used to trigger this command
	 * @param {string} [title] - the embed title
	 */
	getCommandUsage(cmd, prefix = PREFIX_COMMANDS.DEFAULT_PREFIX, invoke, title = 'Usage') {
		let desc = '';
		if (cmd.command.subcommands && cmd.command.subcommands.length > 0) {
			cmd.command.subcommands.forEach((sub) => {
				desc += `-----\n\`\`\`md\n${prefix}${invoke || cmd.name} ${sub.trigger}\`\`\`
				▷ ${sub.description}\n\n`;
			});
			if (cmd.cooldown) {
				desc += `**Cooldown:** ${timeformat(cmd.cooldown)}`;
			}
		} else {
			desc += `\`\`\`md\n${prefix}${invoke || cmd.name} ${cmd.command.usage}\`\`\``;
			if (cmd.description !== '') desc += `\n▷ ${cmd.description}`;
			if (cmd.cooldown) desc += `\n**Cooldown:** ${timeformat(cmd.cooldown)}`;
		}

		const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED).setDescription(desc);
		if (title) embed.setAuthor({ name: title });
		return embed;
	},
};

/**
 * @param {string} memberId
 * @param {object} cmd
 */
function applyCooldown(memberId, cmd) {
	const key = cmd.name + '|' + memberId;
	cooldownCache.set(key, Date.now());
}

/**
 * @param {string} memberId
 * @param {object} cmd
 */
function getRemainingCooldown(memberId, cmd) {
	const key = cmd.name + '|' + memberId;
	if (cooldownCache.has(key)) {
		const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
		if (remaining > cmd.cooldown) {
			cooldownCache.delete(key);
			return 0;
		}
		return cmd.cooldown - remaining;
	}
	return 0;
}
