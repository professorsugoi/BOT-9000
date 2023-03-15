const { getUser } = require('@schemas/User');
const { EmbedBuilder } = require('discord.js');
const { diffHours, getRemainingTime } = require('@helpers/Utils');
const { EMBED_COLORS } = require('@root/config');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'rep',
	description: 'Give reputation to a user',
	category: 'SOCIAL',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		minArgsCount: 1,
		aliases: ['reputation'],
		subcommands: [
			{
				trigger: 'view <user>',
				description: 'view reputation for a user',
			},
			{
				trigger: 'give <user>',
				description: 'give reputation to a user',
			},
		],
	},

	async messageRun(message, args) {
		const sub = args[0];
		let response;

		// status
		if (sub === 'view' || sub === 'v') {
			let target = message.author;
			if (args.length > 1) {
				const resolved = (await message.guild.resolveMember(args[1])) || message.member;
				if (resolved) target = resolved.user;
			}
			response = await viewReputation(target);
		}

		// give
		else if (sub === 'give' || sub === 'g') {
			const target = await message.guild.resolveMember(args[1]);
			if (!target) return message.safeReply('Please provide a valid user to give reputation to');
			response = await giveReputation(message.author, target.user);
		}

		//
		else {
			response = 'usage: `!rep give [user]` || `!rep view [user]`';
		}

		await message.safeReply(response);
	},

	async interactionRun(interaction) {
		const sub = interaction.options.getSubcommand();
		let response;

		// status
		if (sub === 'view' || sub === 'v') {
			const target = interaction.options.getUser('user') || interaction.user;
			response = await viewReputation(target);
		}

		// give
		if (sub === 'give' || sub === 'g') {
			const target = interaction.options.getUser('user');
			response = await giveReputation(interaction.user, target);
		}

		await interaction.followUp(response);
	},
};

async function viewReputation(target) {
	const userData = await getUser(target);
	if (!userData) return `${target.tag} has no reputation yet`;

	const embed = new EmbedBuilder()
		.setAuthor({ name: `Rep for ${target.username}` })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setThumbnail(target.displayAvatarURL())
		.addFields(
			{
				name: 'Given',
				value: userData.reputation?.given.toString(),
				inline: true,
			},
			{
				name: 'Received',
				value: userData.reputation?.received.toString(),
				inline: true,
			}
		);

	return { embeds: [embed] };
}

async function giveReputation(user, target) {
	if (target.bot) return 'You cannot give reputation to bots';
	if (target.id === user.id) return 'You cannot give reputation to yourself';

	const userData = await getUser(user);
	if (userData && userData.reputation.timestamp) {
		const lastRep = new Date(userData.reputation.timestamp);
		const diff = diffHours(new Date(), lastRep);
		if (diff < 24) {
			const nextUsage = lastRep.setHours(lastRep.getHours() + 24);
			return `Reset in \`${getRemainingTime(nextUsage)}\``;
		}
	}

	const targetData = await getUser(target);

	userData.reputation.given += 1;
	userData.reputation.timestamp = new Date();
	targetData.reputation.received += 1;

	await userData.save();
	await targetData.save();

	const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED).setDescription(`${target.toString()} +1 Rep!`);

	return { embeds: [embed] };
}

