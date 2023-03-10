const config = require('@root/config');

module.exports = {
	ADMIN: {
		name: 'Admin',
		image: 'https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png',
		emoji: '⭐',
	},
	AUTOMOD: {
		name: 'Automod',
		enabled: config.AUTOMOD.ENABLED,
		image: 'https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png',
		emoji: '👁‍🗨',
	},
	FUN: {
		name: 'Fun',
		image: 'https://icons.iconarchive.com/icons/flameia/aqua-smiles/128/make-fun-icon.png',
		emoji: '🍥',
	},
	GIVEAWAY: {
		name: 'Giveaway',
		enabled: config.GIVEAWAYS.ENABLED,
		image: 'https://cdn-icons-png.flaticon.com/512/4470/4470928.png',
		emoji: '🎉',
	},
	INVITE: {
		name: 'Invite',
		enabled: config.INVITE.ENABLED,
		image: 'https://cdn4.iconfinder.com/data/icons/general-business/150/Invite-512.png',
		emoji: '✉',
	},
	INFORMATION: {
		name: 'Information',
		image: 'https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png',
		emoji: 'ℹ',
	},
	MODERATION: {
		name: 'Moderation',
		enabled: config.MODERATION.ENABLED,
		image: 'https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png',
		emoji: '🐸',
	},
	OWNER: {
		name: 'Owner',
		image: 'https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png',
		emoji: '🖤',
	},
	SOCIAL: {
		name: 'Social',
		image: 'https://icons.iconarchive.com/icons/dryicons/aesthetica-2/128/community-users-icon.png',
		emoji: '🌱',
	},
	STATS: {
		name: 'Statistics',
		enabled: config.STATS.ENABLED,
		image: 'https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png',
		emoji: '📈',
	},
	UTILITY: {
		name: 'Utility',
		image: 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png',
		emoji: '🛠',
	},
};

