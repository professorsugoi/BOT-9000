const { model, Schema } = require('mongoose');

const dbSchema = new Schema({
    GuildID: String,
    UserID: String,
});

module.exports = model('dbSchema', dbSchema);

// store warnings, user roles, levels, exp points, etc...