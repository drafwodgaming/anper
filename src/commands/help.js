import mustache from 'mustache'
import { createCommandConfig, portal } from 'robo.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = createCommandConfig({
	description: 'Get the list of commands for the bot',
	descriptionLocalizations: {
		ru: 'Отобразить список команд бота',
		uk: 'Показати список команд бота',
	},
	contexts: ['Guild', 'BotDM'],
})

export default async interaction => {
	const botCommands = Array.from(portal.commands.entries())
	const locale = await getLocalizedText(interaction)

	const sortedCommandList = botCommands
		.sort(([commandNameA], [commandNameB]) =>
			commandNameA.localeCompare(commandNameB)
		)
		.map(
			([commandName, commandData]) =>
				`• \`${commandName}\` — ${commandData.description}`
		)
		.join('\n')

	const localizedMessage = mustache.render(locale.commands.help.title, {
		commandList: sortedCommandList,
	})

	return { content: localizedMessage, flags: 64 }
}
