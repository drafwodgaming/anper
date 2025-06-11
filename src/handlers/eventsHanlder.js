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
			const eventModule = await import(pathToFileURL(filePath).href)

			const { event } = eventModule
			const execute = eventModule.default

			if (!event || !event.name || typeof execute !== 'function') {
				console.warn(`⚠️ Event ${file} имеет неправильные экспорты`)
				continue
			}

			const listener = (...args) => execute(...args, client)

			if (event.once) {
				client.once(event.name, listener)
			} else {
				client.on(event.name, listener)
			}
		}

		console.log('✅ Loaded events')
	}
}
