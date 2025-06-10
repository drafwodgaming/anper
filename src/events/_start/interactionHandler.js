import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const baseDir = path.join(process.cwd(), '.robo', 'build')

const handlers = {
	buttons: {
		dir: path.join(baseDir, 'buttons'),
		map: new Map(),
	},
	modals: {
		dir: path.join(baseDir, 'modals'),
		map: new Map(),
	},
	selectors: {
		dir: path.join(baseDir, 'selectors'),
		map: new Map(),
	},
}

const getJSFiles = dir => {
	const files = []

	if (!existsSync(dir)) return files

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) files.push(...getJSFiles(fullPath))
		else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath)
	}

	return files
}

const loadHandlers = async (dir, map, label) => {
	const files = getJSFiles(dir)
	if (!files.length)
		return {
			label,
			results: [`⚠️  Warning: no files found in directory ${label} (${dir})`],
		}

	const results = []

	await Promise.all(
		files.map(async file => {
			const fileUrl = pathToFileURL(file).href
			const handler = await import(fileUrl)

			if (!handler.customID || typeof handler.default !== 'function') {
				results.push(
					`⚠️  File missing (invalid handler): ${handler.customID ?? file}`
				)
				return
			}

			map.set(handler.customID, handler.default)
			results.push(`✅ ${handler.customID}`)
		})
	)

	return { label, results }
}

export const ButtonHandlers = handlers.buttons.map
export const ModalHandlers = handlers.modals.map
export const SelectorHandlers = handlers.selectors.map

export default async () => {
	const resultsByGroup = await Promise.all([
		loadHandlers(handlers.buttons.dir, ButtonHandlers, 'button'),
		loadHandlers(handlers.modals.dir, ModalHandlers, 'modal'),
		loadHandlers(handlers.selectors.dir, SelectorHandlers, 'selector'),
	])

	for (const { label, results } of resultsByGroup) {
		console.log(`\n📂 [ ${label} ]:`)
		for (const result of results) {
			console.log(`  ${result}`)
		}
	}
}
