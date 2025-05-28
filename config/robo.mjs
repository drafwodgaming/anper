// @ts-check

/**
 * @type {import('robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: [
			'Guilds',
			'GuildMembers',
			'GuildModeration',
			'GuildEmojisAndStickers',
			'GuildIntegrations',
			'GuildWebhooks',
			'GuildInvites',
			'GuildVoiceStates',
			'GuildPresences',
			'GuildMessages',
			'GuildMessageReactions',
			'GuildMessageTyping',
			'DirectMessages',
			'DirectMessageReactions',
			'DirectMessageTyping',
			'MessageContent',
			'GuildScheduledEvents',
		],
	},
	plugins: [],
	sage: {
		defer: true,
		deferBuffer: 1000,
		errorReplies: false,
	},
	type: 'robo',
	defaults: {
		contexts: ['Guild'],
		dev: false,
		help: false,
	},
}
