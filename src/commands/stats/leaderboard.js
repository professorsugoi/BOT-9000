const { EmbedBuilder, escapeInlineCode } = require('discord.js');
const { EMBED_COLORS } = require('@root/config');
const { getXpLb } = require('@schemas/MemberStats');
const { getReputationLb } = require('@schemas/User');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'leaderboard',
	description: 'Display a leaderboard',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		aliases: ['lb'],
		minArgsCount: 1,
		usage: '<xp|rep>',
	},

	async messageRun(message, args, data) {
		const type = args[0].toLowerCase();
		let response;

		if (type === 'xp') response = await getXpLeaderboard(message, message.author, data.settings);
		else if (type === 'rep') response = await getRepLeaderboard(message.author);
		else response = 'Invalid Leaderboard type. Choose either `xp` or `rep`';
		await message.safeReply(response);
	},
};

async function getXpLeaderboard({ guild }, author, settings) {
	if (!settings.stats.enabled) return 'Ranking is disabled on this server';

	const lb = await getXpLb(guild.id, 10);
	if (lb.length === 0) return 'No users in the leaderboard';

	let collector = '';
	for (let i = 0; i < lb.length; i++) {
		try {
			const user = await author.client.users.fetch(lb[i].member_id);
			collector += `**#${(i + 1).toString()}** - ${escapeInlineCode(user.tag)}\n`;
		} catch (ex) {
			// Ignore
		}
	}

	const embed = new EmbedBuilder()
		.setAuthor({ name: 'XP Leaderboard' })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setDescription(collector)
		.setFooter({ text: `Requested by ${author.tag}` });

	return { embeds: [embed] };
}

async function getRepLeaderboard(author) {
	const lb = await getReputationLb(10);
	if (lb.length === 0) return 'No users in the leaderboard';

	const collector = lb
		.map((user, i) => `**#${(i + 1).toString()}** - ${escapeInlineCode(user.username)} (${user.reputation?.received})`)
		.join('\n');

	const embed = new EmbedBuilder()
		.setAuthor({ name: 'Reputation Leaderboard' })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setDescription(collector)
		.setFooter({ text: `Requested by ${author.tag}` });

	return { embeds: [embed] };
}

