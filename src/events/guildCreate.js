import serverLocaleShema from '../schemas/serverLocale.js'

export default async guild => {
	console.log(`Joined guild ${guild.name} with ${guild.memberCount} members!`)

	await serverLocaleShema.updateOne(
		{ Guild: guild.id },
		{ $set: { Language: 'en' } },
		{ upsert: true }
	)
}
