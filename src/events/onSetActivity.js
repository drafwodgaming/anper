import { ActivityType, Events } from 'discord.js'

export const event = { name: Events.ClientReady, once: true }

export default async client => {
	client.user?.setActivity({
		name: '🔪 Killing time w/ Anper',
		type: ActivityType.Custom,
	})
}
