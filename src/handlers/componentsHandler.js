import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

function getAllJsFiles(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) files.push(...getAllJsFiles(fullPath))
		else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath)
	}

	return files
}

export default (client, sourcePath) => {
	client.componentsHandler = async () => {
		const { modals, buttons, selectMenus } = client
		const componentsFolderPath = path.join(sourcePath, 'components')
		const componentFolders = fs.readdirSync(componentsFolderPath)

		for (const folder of componentFolders) {
			const folderPath = path.join(componentsFolderPath, folder)
			const componentFiles = getAllJsFiles(folderPath)

			for (const filePathFull of componentFiles) {
				const componentModule = await import(pathToFileURL(filePathFull).href)

				const id = componentModule.customID
				const action = componentModule.default

				if (!id) {
					console.warn(
						`⚠️ В компоненте ${filePathFull} не найден export const customID`
					)
					continue
				}
				if (!action) {
					console.warn(
						`⚠️ В компоненте ${filePathFull} не найден export default (функция)`
					)
					continue
				}

				switch (folder) {
					case 'modals':
						modals.set(id, action)
						break
					case 'buttons':
						buttons.set(id, action)
						break
					case 'menus':
						selectMenus.set(id, action)
						break
					default:
						console.warn(`⚠️ Неизвестная папка компонентов: ${folder}`)
				}
			}
		}

		console.log('✅ Loaded components')
	}
}
