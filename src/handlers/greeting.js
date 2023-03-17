const { getMember } = require('@schemas/Member');
const { getSettings } = require('@schemas/Guild');
const { INVITES } = require('@root/config');

/**
 * parse variables for easier user reference
 */
const parse = async (content, member, usedInvite = {}, inviteName) => {
	return content
		.replaceAll(/\\n/g, '\n')
		.replaceAll(/{server}/g, member.guild.name)
		.replaceAll(/{count}/g, member.guild.memberCount)
		.replaceAll(/{user:nick}/g, member.displayName)
		.replaceAll(/{user:name}/g, member.user.username)
		.replaceAll(/{user:tag}/g, member.user.tag)
		.replaceAll(/{user:mention}/g, member.toString())
		.replaceAll(/{invite:source}/g, usedInvite?.channel?.toString() || inviteName || 'an unknown source');
};

/**
 * build greeting
 */
const buildGreeting = async (member, type, config, inviteName, usedInvite) => {
	if (!config) return;
	let content;

	// build content
	if (config.content) content = await parse(config.content, member, inviteName, usedInvite);

	// set default message
	if (!config.content) {
		content =
			type === 'WELCOME'
				? `${member.toString()} joined from ${usedInvite?.channel?.toString() || inviteName}!🎉`
				: `${member.toString()} has left the server 👋`;
	}
	return { content };
};

/**
 * Send welcome message
 */
async function sendWelcome(member = {}) {
	const config = (await getSettings(member.guild))?.welcome;
	if (!config || !config.enabled) return;

	// check if channel exists
	const channel = member.guild.channels.cache.get(config.channel);
	if (!channel) return;

	const memberData = await getMember(member.guild.id, member.id);
	if (!memberData || !memberData.invite_data || !memberData.invite_data.inviter) return;

	const fetchedInvites = await member.guild.invites.fetch();
	const usedInvite = fetchedInvites.find(
		(invite) => invite.code === memberData.invite_data.code && invite.uses > memberData.invite_data.uses
	);
	const inviteName = INVITES[memberData.invite_data.code] || memberData.invite_data.code;

	// send welcome message
	const response = await buildGreeting(member, 'WELCOME', config, inviteName, usedInvite);
	channel.safeSend(response);
}

/**
 * Send farewell message
 */
async function sendFarewell(member = {}) {
	const config = (await getSettings(member.guild))?.farewell;
	if (!config || !config.enabled) return;

	// check if channel exists
	const channel = member.guild.channels.cache.get(config.channel);
	if (!channel) return;

	// send farewell message
	const response = await buildGreeting(member, 'FAREWELL', config);
	channel.safeSend(response);
}

module.exports = {
	buildGreeting,
	sendWelcome,
	sendFarewell,
};
