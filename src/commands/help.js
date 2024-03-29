const { CommandCategory, BotClient } = require('@src/structures');
const { EMBED_COLORS, SUPPORT_SERVER } = require('@root/config.js');
const {
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	Message,
	ButtonBuilder,
	CommandInteraction,
	ButtonStyle,
} = require('discord.js');
const { getCommandUsage } = require('@handlers/command');

const CMDS_PER_PAGE = 10;
const IDLE_TIMEOUT = 30;

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'help',
	description: 'Shows available commands without arg. shows command usage with arg.',
	category: 'UTILITY',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		usage: '<arg>',
	},

	/////////////////PREFIX CMD/////////////////////////////////////////
	async messageRun(message, args, data) {
		let trigger = args[0];

		// !help
		if (!trigger) {
			const response = await getHelpMenu(message);
			const sentMsg = await message.safeReply(response);
			return waiter(sentMsg, message.author.id, data.prefix);
		}

		// check if command help (!help cat)
		const cmd = message.client.getCommand(trigger);
		if (cmd) {
			const embed = getCommandUsage(cmd, data.prefix, trigger);
			return message.safeReply({ embeds: [embed] });
		}

		// No matching command/category found
		await message.safeReply('No matching command found');
	},
};

/**
 * @param {CommandInteraction} interaction
 */
async function getHelpMenu({ client, guild }) {
	// Menu Row
	const options = [];
	for (const [k, v] of Object.entries(CommandCategory)) {
		if (v.enabled === false) continue;
		options.push({
			label: v.name,
			value: k,
			description: `View commands in ${v.name} category`,
			emoji: v.emoji,
		});
	}

	const menuRow = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('help-menu')
			.setPlaceholder('Choose the command category')
			.addOptions(options)
	);

	// Buttons Row
	let components = [];
	components.push(
		new ButtonBuilder().setCustomId('previousBtn').setEmoji('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(true),
		new ButtonBuilder().setCustomId('nextBtn').setEmoji('➡️').setStyle(ButtonStyle.Secondary).setDisabled(true)
	);

	let buttonsRow = new ActionRowBuilder().addComponents(components);

	const embed = new EmbedBuilder()
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(
			'**Helo!**\n' +
				`I'm **${guild.members.me.displayName}**,\n` +
				`A custom bot for **${guild.name}**!\n\n` +
				`Browse the commands below and don't forget to claim your \`!daily\` (人´∀\`) ~♪ `
			// + `**Invite Me:** [Here](${client.getInvite()})\n` +
			// `**Support Server:** [Join](${SUPPORT_SERVER})`
		);

	return {
		embeds: [embed],
		components: [menuRow, buttonsRow],
	};
}

/**
 * @param {Message} msg
 * @param {string} userId
 * @param {string} prefix
 */
const waiter = (msg, userId, prefix) => {
	const collector = msg.channel.createMessageComponentCollector({
		filter: (reactor) => reactor.user.id === userId && msg.id === reactor.message.id,
		idle: IDLE_TIMEOUT * 1000,
		dispose: true,
		time: 5 * 60 * 1000,
	});

	let arrEmbeds = [];
	let currentPage = 0;
	let menuRow = msg.components[0];
	let buttonsRow = msg.components[1];

	collector.on('collect', async (response) => {
		if (!['help-menu', 'previousBtn', 'nextBtn'].includes(response.customId)) return;
		await response.deferUpdate();

		switch (response.customId) {
			case 'help-menu': {
				const cat = response.values[0].toUpperCase();
				arrEmbeds = getMsgCategoryEmbeds(msg.client, cat, prefix);
				currentPage = 0;

				// Buttons Row
				let components = [];
				buttonsRow.components.forEach((button) =>
					components.push(ButtonBuilder.from(button).setDisabled(arrEmbeds.length > 1 ? false : true))
				);

				buttonsRow = new ActionRowBuilder().addComponents(components);
				msg.editable && (await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }));
				break;
			}

			case 'previousBtn':
				if (currentPage !== 0) {
					--currentPage;
					msg.editable && (await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }));
				}
				break;

			case 'nextBtn':
				if (currentPage < arrEmbeds.length - 1) {
					currentPage++;
					msg.editable && (await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }));
				}
				break;
		}
	});

	collector.on('end', () => {
		if (!msg.guild || !msg.channel) return;
		if (msg.editable) {
			msg.edit({
				content: 'Timed out (-_ゝ-) Z z z',
				embeds: [],
				components: [],
			});
		}
	});
};

/**
 * Returns an array of message embeds for a particular command category [MESSAGE COMMANDS]
 * @param {BotClient} client
 * @param {string} category
 * @param {string} prefix
 */
function getMsgCategoryEmbeds(client, category, prefix) {
	// For ALL Categories
	const commands = client.commands.filter((cmd) => cmd.category === category);

	if (commands.length === 0) {
		const embed = new EmbedBuilder()
			.setColor(EMBED_COLORS.BOT_EMBED)
			.setThumbnail(CommandCategory[category]?.image)
			.setAuthor({ name: `${category} Commands` })
			.setDescription('No commands in this category');

		return [embed];
	}

	const arrSplitted = [];
	const arrEmbeds = [];

	while (commands.length) {
		let toAdd = commands.splice(0, commands.length > CMDS_PER_PAGE ? CMDS_PER_PAGE : commands.length);
		toAdd = toAdd.map((cmd) => `\`${prefix}${cmd.name}\`\n ▷ ${cmd.description}\n`);
		arrSplitted.push(toAdd);
	}

	arrSplitted.forEach((item, index) => {
		const embed = new EmbedBuilder()
			.setColor(EMBED_COLORS.BOT_EMBED)
			.setThumbnail(CommandCategory[category]?.image)
			.setAuthor({ name: `${category} Commands` })
			.setDescription(item.join('\n'))
			.setFooter({
				text: `page ${index + 1} of ${arrSplitted.length} | Type ${prefix}help <command> for more command information`,
			});
		arrEmbeds.push(embed);
	});

	return arrEmbeds;
}
