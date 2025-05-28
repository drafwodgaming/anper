import { readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ButtonsDir = path.join(process.cwd(), '.robo', 'build', 'buttons')
const ModalsDir = path.join(process.cwd(), '.robo', 'build', 'modals')
const SelectorDir = path.join(process.cwd(), '.robo', 'build', 'selectors')

export const ButtonHandlers = new Map()
export const ModalHandlers = new Map()
export const SelectorHandlers = new Map()

function getAllFiles(dir) {
	const files = []

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) {
			files.push(...getAllFiles(fullPath))
		} else if (entry.isFile() && fullPath.endsWith('.js')) {
			files.push(fullPath)
		}
	}

	return files
}

export default async () => {
	await Promise.all([
		...readdirSync(ButtonsDir).map(async fileName => {
			const filePath = path.join(ButtonsDir, fileName)
			const fileURL = pathToFileURL(filePath).href
			const handler = await import(fileURL)
			ButtonHandlers.set(handler.customID, handler.default)
		}),
		...readdirSync(ModalsDir).map(async fileName => {
			const filePath = path.join(ModalsDir, fileName)
			const fileURL = pathToFileURL(filePath).href
			const handler = await import(fileURL)
			ModalHandlers.set(handler.customID, handler.default)
		}),
		...getAllFiles(SelectorDir).map(async filePath => {
			const fileURL = pathToFileURL(filePath).href
			const handler = await import(fileURL)
			SelectorHandlers.set(handler.customID, handler.default)
		}),
	])
}
