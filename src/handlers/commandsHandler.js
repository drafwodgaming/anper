import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.commandsHandler = async () => {
		const { commands, commandsArray } = client
		const commandsPath = path.join(sourcePath, 'commands')
		const commandFiles = fs.readdirSync(commandsPath).filter(file => {
			return !file.startsWith('[off]') && file.endsWith('.js')
		})

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file)
			const { default: command } = await import(pathToFileURL(filePath).href)

			commands.set(command.data.name, command)
			commandsArray.push(command.data.toJSON())
		}

		console.log('✅ Loaded commands')
	}
}
