import { ActivityType } from 'discord.js'

export default async client => {
	client.user?.setActivity({
		name: '🔪 Killing time w/ Anper',
		type: ActivityType.Custom,
	})
}
