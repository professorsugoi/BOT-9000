const { EmbedBuilder } = require('discord.js');
const { getUser } = require('@schemas/User');
const { EMBED_COLORS } = require('@root/config.js');
const { diffHours, getRemainingTime } = require('@helpers/Utils');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'daily',
	description: 'Claim daily reputation',
	category: 'SOCIAL',
	command: {
		enabled: true,
		usage: '',
		aliases: ['d'],
	},

	async messageRun(message) {
		const user = message.author;
		const response = await claimDaily(user);
		await message.safeReply(response);
	},
};

async function claimDaily(user) {
	const userData = await getUser(user);
	let streak = 0;

	if (userData && userData.reputation.timestamp) {
		const lastRep = new Date(userData.reputation.timestamp);
		const diff = diffHours(new Date(), lastRep);
		if (diff < 24) {
			const nextUsage = lastRep.setHours(lastRep.getHours() + 24);
			return `Reset in \`${getRemainingTime(nextUsage)}\``;
		}
		streak = userData.daily.streak || streak;
		if (diff < 48) streak += 1;
		else streak = 0;
	}

	userData.reputation.streak = streak;
	userData.reputation.timestamp = new Date();
	userData.reputation.claimed += 1;
	await userData.save();

	const embed = new EmbedBuilder()
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setDescription(
			`${user.tag} +1 Rep!\n` + `Total: ${userData.reputation}.\n` + `Streak: ${userData.reputation.streak}`
		);

	return { embeds: [embed] };
}

