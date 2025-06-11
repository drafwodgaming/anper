import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.commandsHandler = async () => {
		const commandsPath = path.join(sourcePath, 'commands')
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter(file => !file.startsWith('[off]') && file.endsWith('.js'))

		const commands = new Map()
		const commandsArray = []

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file)
			const commandModule = await import(pathToFileURL(filePath).href)

			if (commandModule.config && commandModule.default) {
				commands.set(commandModule.config.name, {
					data: commandModule.config,
					execute: commandModule.default,
				})

				commandsArray.push(commandModule.config.toJSON())
			} else {
				console.warn(
					`⚠️ Команда ${file} не имеет корректных экспортов data и default.`
				)
			}
		}

		client.commands = commands
		client.commandsArray = commandsArray

		console.log(`✅ Loaded commands`)
	}
}
