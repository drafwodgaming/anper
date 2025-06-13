import fg from 'fast-glob'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.commandsHandler = async () => {
		const commandsPath = path.join(sourcePath, 'commands')
		const files = await fg('**/*.js', {
			cwd: commandsPath,
			absolute: true,
		})

		const commands = new Map()
		const commandsArray = []

		for (const file of files) {
			const module = await import(pathToFileURL(file).href)

			// Проверка: поддерживается только { default: { config, execute, autocomplete? } }
			const { config, execute, autocomplete } = module.default

			if (!config || !execute) {
				console.warn(`⚠️  Команда в ${file} не содержит config или execute.`)
				continue
			}

			// Кладём полную команду
			commands.set(config.name, { config, execute, autocomplete })

			// Для регистрации в Discord API
			commandsArray.push(
				typeof config.toJSON === 'function' ? config.toJSON() : config
			)
		}

		client.commands = commands
		client.commandsArray = commandsArray

		console.log('✅ Loaded commands')
	}
}
