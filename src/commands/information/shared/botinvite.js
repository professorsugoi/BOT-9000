const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLORS, SUPPORT_SERVER, DASHBOARD } = require('@root/config');

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

	if (DASHBOARD.enabled) {
		components.push(
			new ButtonBuilder().setLabel('Dashboard Link').setURL(DASHBOARD.baseURL).setStyle(ButtonStyle.Link)
		);
	}

	let buttonsRow = new ActionRowBuilder().addComponents(components);
	return { embeds: [embed], components: [buttonsRow] };
};

