const config = require('@root/config');

module.exports = {
	MOST_USED: {
		name: 'Most Used',
		image: 'https://img.icons8.com/nolan/256/1A6DFF/C822FF/star.png',
		emoji: '⭐',
	},
	ADMIN: {
		name: 'Admin',
		image: 'https://img.icons8.com/nolan/256/omori-sprite.png',
		emoji: '👁‍🗨',
	},
	AUTOMOD: {
		name: 'Automod',
		enabled: config.AUTOMOD.ENABLED,
		image: 'https://img.icons8.com/nolan/256/bot.png',
		emoji: '👁‍🗨',
	},
	GIVEAWAY: {
		name: 'Giveaway',
		enabled: config.GIVEAWAYS.ENABLED,
		image: 'https://img.icons8.com/nolan/256/confetti.png',
		emoji: 'ℹ',
	},
	INFORMATION: {
		name: 'Information',
		image: 'https://img.icons8.com/nolan/256/1A6DFF/C822FF/information.png',
		emoji: 'ℹ',
	},
	MODERATION: {
		name: 'Moderation',
		enabled: config.MODERATION.ENABLED,
		image: 'https://img.icons8.com/nolan/256/1A6DFF/C822FF/millenium-eye.png',
		emoji: '👁‍🗨',
	},
	OWNER: {
		name: 'Owner',
		image: 'https://img.icons8.com/nolan/256/third-eye-symbol.png',
		emoji: '👁‍🗨',
	},
	SOCIAL: {
		name: 'Social',
		image: 'https://img.icons8.com/nolan/1x/1A6DFF/C822FF/filled-like.png',
		emoji: 'ℹ',
	},
	STATS: {
		name: 'Statistics',
		enabled: config.STATS.ENABLED,
		image: 'https://img.icons8.com/nolan/256/1A6DFF/C822FF/combo-chart.png',
		emoji: 'ℹ',
	},
	UTILITY: {
		name: 'Utility',
		image: 'https://img.icons8.com/nolan/256/fantasy.png',
		emoji: 'ℹ',
	},
};

