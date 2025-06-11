import { ActivityType, Events } from 'discord.js'

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user?.setActivity({
			name: '🔪 Killing time w/ Anper',
			type: ActivityType.Custom,
		})
	},
}
