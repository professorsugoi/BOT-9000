const infoUser = require('./sub/infoUser.js');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'info',
	description: 'show various information',
	category: 'INFORMATION',
	botPermissions: ['EmbedLinks'],
	command: {
		enabled: true,
		subcommands: [
			{
				trigger: 'user',
				description: 'get info for a user',
			},
			// {
			// 	trigger: 'channel <channel>',
			// 	description: 'test',
			// },
		],
	},

	async messageRun(message, args) {
		const sub = args[0];
		if (!sub) return message.safeReply('Use `!info [query]` to get information about a query.');

		let response;

		// user
		if (sub === 'user') {
			const target = args[1] ? await message.guild.resolveMember(args[1]) : message.member;
			if (!target) {
				return message.safeReply('User not found. Please provide a valid user.');
			}
			response = infoUser(target);
		} else {
			return message.safeReply(`\`${args[0]}\` is not a valid subcommand.`);
		}

		// // channel
		// else if (sub === 'channel') {
		// 	const target = message.mentions.channels.first() || message.channel;
		// 	response = await info_channel(target.channel);
		// }

		// // guild
		// else if (sub === 'guild' || sub === 'server') {
		// 	response = await info_guild(message.guild);
		// }

		// // bot
		// else if (sub === 'bot') {
		// 	response = info_bot(message.client);
		// }

		// // avatar
		// else if (sub === 'avatar' || sub === 'pfp') {
		// 	const target = message.mentions.members.first() || message.member;
		// 	response = info_avatar(target);
		// }

		// // emoji
		// else if (sub === 'emoji') {
		// 	let emoji = message.options.getString('name');
		// 	response = info_emoji(emoji);
		// }

		// return
		// else {
		// 	response = 'Incorrect subcommand';
		// }

		await message.safeReply(response);
	},
};
