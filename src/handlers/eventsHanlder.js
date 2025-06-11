import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.eventsHandler = async () => {
		const eventsPath = path.join(sourcePath, 'events')
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter(file => file.endsWith('.js'))

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file)
			const { default: event } = await import(pathToFileURL(filePath).href)

			const listener = (...args) => event.execute(...args, client)

			if (event.once) {
				client.once(event.name, listener)
			} else {
				client.on(event.name, listener)
			}
		}

		console.log('✅ Loaded events')
	}
}
