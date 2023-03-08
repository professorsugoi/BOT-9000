const { SlashCommandBuilder } = require('@discordjs/builders');
const dbSchema = require('./schemas/schemas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dbtest')
        .setDescription('db test'),
    async execute(interaction) {
        try {
            const data = await dbSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id });

            if (!data) {
                await dbSchema.create({
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id,
                });
            }

            if (data) {
                const user = data.UserID;
                const guild = data.GuildID;

                console.log({ user, guild });
            }
            console.log(data);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    },
};
