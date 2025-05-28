import fs from 'fs'
import path from 'path'

/**
 * @param {string} dirPath
 * @returns {Promise<string[]>}
 */
async function getAllFiles(dirPath) {
	let results = []
	const list = await fs.promises.readdir(dirPath)

	for (const file of list) {
		const fullPath = path.join(dirPath, file)
		const stat = await fs.promises.stat(fullPath)

		if (stat.isDirectory()) {
			const subFiles = await getAllFiles(fullPath)
			results = results.concat(subFiles)
		} else if (file.endsWith('.json')) {
			results.push(fullPath)
		}
	}
	return results
}

let isFilesRead = false

export default async function (data) {
	if (isFilesRead) return data
	isFilesRead = true

	try {
		const botDirectory = path.resolve('config/bot')
		const jsonFiles = await getAllFiles(botDirectory)
		console.log('\x1b[34m%s\x1b[0m', '🌟 Найденные JSON файлы:')
		jsonFiles.forEach((file, index) => {
			console.log(`\x1b[36m${index + 1}.\x1b[0m ${file}`)
		})

		global.languages = {}
		global.emojis = {}

		for (const file of jsonFiles) {
			try {
				const content = await fs.promises.readFile(file, 'utf8')
				const parsed = JSON.parse(content)
				const fileName = path.basename(file, '.json')
				const parentDir = path.basename(path.dirname(file))

				console.log(`\x1b[32mЧтение файла:\x1b[0m ${file}`)

				if (parentDir === 'languages') global.languages[fileName] = parsed
				else if (fileName === 'emojis') Object.assign(global.emojis, parsed)
			} catch (err) {
				console.error(`\x1b[31mОшибка при парсинге файла\x1b[0m ${file}:`, err)
			}
		}

		console.log(
			'\x1b[34m%s\x1b[0m',
			'✅ Языки загружены:',
			Object.keys(global.languages)
		)
		console.log(
			'\x1b[34m%s\x1b[0m',
			'✅ Эмодзи загружены:',
			Object.keys(global.emojis)
		)

		return data
	} catch (err) {
		console.error(
			'\x1b[31m%s\x1b[0m',
			'⚠️ Ошибка при загрузке конфигурации:',
			err
		)
		throw new Error('Не удалось загрузить файлы конфигурации')
	}
}
