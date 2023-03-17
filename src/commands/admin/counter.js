const { ChannelType } = require('discord.js');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	name: 'counter',
	description: 'setup counter channel in the guild',
	category: 'ADMIN',
	userPermissions: ['ManageGuild'],
	botPermissions: ['ManageChannels'],
	command: {
		enabled: true,
		usage: '<type> <channel-name>',
		minArgsCount: 1,
	},

	async messageRun(message, args, data) {
		const type = args[0].toUpperCase();
		if (!type || !['USERS', 'MEMBERS', 'BOTS'].includes(type)) {
			return message.safeReply('Incorrect arguments are passed! Counter types: `users/members/bots`');
		}
		if (args.length < 2) return message.safeReply('Incorrect Usage! You did not provide name');
		args.shift();
		let channelName = args.join(' ');

		const response = await setupCounter(message.guild, type, channelName, data.settings);
		return message.safeReply(response);
	},
};

/**
 * @param {import('discord.js').Guild} guild
 * @param {string} type
 * @param {string} name
 * @param {object} settings
 */
async function setupCounter(guild, type, name, settings) {
	let channelName = name;

	const stats = await guild.fetchMemberStats();
	if (type === 'USERS') channelName += ` : ${stats[0]}`;
	else if (type === 'MEMBERS') channelName += ` : ${stats[2]}`;
	else if (type === 'BOTS') channelName += ` : ${stats[1]}`;

	const vc = await guild.channels.create({
		name: channelName,
		type: ChannelType.GuildVoice,
		permissionOverwrites: [
			{
				id: guild.roles.everyone,
				deny: ['Connect'],
			},
			{
				id: guild.members.me.id,
				allow: ['ViewChannel', 'ManageChannels', 'Connect'],
			},
		],
	});

	const exists = settings.counters.find((v) => v.counter_type.toUpperCase() === type);
	if (exists) {
		exists.name = name;
		exists.channel_id = vc.id;
	} else {
		settings.counters.push({
			counter_type: type,
			channel_id: vc.id,
			name,
		});
	}

	settings.data.bots = stats[1];
	await settings.save();

	return 'Configuration saved! Counter channel created';
}
