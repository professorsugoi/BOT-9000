const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get info about a user or a server!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Info about the server')),
	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('target') || interaction.user;
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Info`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields([
                    { name: 'Username', value: `${user.username}`, inline: true },
                    { name: 'Discriminator', value: `${user.discriminator}`, inline: true },
                    { name: 'ID', value: `${user.id}`, inline: true },
                    { name: 'Created At', value:`${user.createdAt.toDateString()}`, inline:true },
                ]);
            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'server') {
            const guild = interaction.guild;
            const embed = new EmbedBuilder()
                .setTitle(`${guild.name}'s Info`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields([
                    { name:'Name', value:`${guild.name}`, inline:true },
                    { name:'ID', value:`${guild.id}`, inline:true },
                    { name:'Owner ID', value:`${guild.ownerId}`, inline:true },
                    { name:'Created At', value:`${guild.createdAt.toDateString()}`, inline:true },
                ]);
            await interaction.reply({ embeds: [embed] });
        }
    },
};