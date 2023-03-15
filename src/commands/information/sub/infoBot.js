////////////
// make this more clear on usage
// gives invite, not info

const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLORS, SUPPORT_SERVER } = require('@root/config');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
	async messageRun(message, args) {
		const response = botinvite(message.client);
		try {
			await message.author.send(response);
			return message.safeReply('Check your DM for my information! :envelope_with_arrow:');
		} catch (ex) {
			return message.safeReply('I cannot send you my information! Is your DM open?');
		}
	},
};

module.exports = (client) => {
	const embed = new EmbedBuilder()
		.setAuthor({ name: 'Invite' })
		.setColor(EMBED_COLORS.BOT_EMBED)
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription('⚠ I am still in development! ٩(◕‿◕｡)۶\n Invite me to your server at your own risk.');

	// Buttons
	let components = [];
	components.push(new ButtonBuilder().setLabel('Invite Link').setURL(client.getInvite()).setStyle(ButtonStyle.Link));

	if (SUPPORT_SERVER) {
		components.push(new ButtonBuilder().setLabel('Support Server').setURL(SUPPORT_SERVER).setStyle(ButtonStyle.Link));
	}

	let buttonsRow = new ActionRowBuilder().addComponents(components);
	return { embeds: [embed], components: [buttonsRow] };
};

