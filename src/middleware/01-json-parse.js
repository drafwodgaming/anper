import fs from 'fs'
import path from 'path'

async function getJsonFiles(dir) {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true })
	let files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			const nestedFiles = await getJsonFiles(fullPath)
			files = files.concat(nestedFiles)
		} else if (entry.isFile() && entry.name.endsWith('.json')) {
			files.push(fullPath)
		}
	}
	return files
}

let isFilesRead = false

export default async function (data) {
	if (isFilesRead) return data
	isFilesRead = true

	const baseDir = path.resolve('config/bot')
	const jsonFiles = await getJsonFiles(baseDir)

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

	return data
}
