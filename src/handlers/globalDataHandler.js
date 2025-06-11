import fs from 'fs'
import path from 'path'

export default (client, sourcePath) => {
	client.globalDataHandler = async () => {
		const baseDir = path.join(sourcePath, '..', 'config', 'bot')
		const stack = [baseDir]
		const jsonFiles = []

		while (stack.length > 0) {
			const currentDir = stack.pop()
			const entries = await fs.promises.readdir(currentDir, {
				withFileTypes: true,
			})

			for (const entry of entries) {
				const fullPath = path.join(currentDir, entry.name)
				if (entry.isDirectory()) stack.push(fullPath)
				else if (entry.isFile() && entry.name.endsWith('.json'))
					jsonFiles.push(fullPath)
			}
		}

		const languages = {}
		const emojis = {}

		for (const file of jsonFiles) {
			const content = await fs.promises.readFile(file, 'utf8')
			const parsed = JSON.parse(content)
			const fileName = path.basename(file, '.json')
			const parentDir = path.basename(path.dirname(file))

			if (parentDir === 'languages') languages[fileName] = parsed
			else if (fileName === 'emojis') Object.assign(emojis, parsed)
		}

		global.languages = languages
		global.emojis = emojis

		console.log('✅ Loaded languages')
		console.log('✅ Loaded emojis')
	}
}
