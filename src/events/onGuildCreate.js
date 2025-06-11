import { Events } from 'discord.js'
import serverLocaleShema from '../schemas/serverLocale.js'

export default {
	name: Events.GuildCreate,
	async execute(guild) {
		console.log(`Joined guild ${guild.name} with ${guild.memberCount} members!`)

		await serverLocaleShema.updateOne(
			{ Guild: guild.id },
			{ $set: { Language: 'en' } },
			{ upsert: true }
		)
	},
}
