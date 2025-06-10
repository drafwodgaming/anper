import mustache from 'mustache'
import { portal } from 'robo.js'
import { getLocalizedText } from '../../../utils/general/getLocale.js'

export const handleHelpCommand = async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)

	const botCommands = Array.from(portal.commands.entries())
	const sortedCommandList = botCommands
		.sort(([commandNameA], [commandNameB]) =>
			commandNameA.localeCompare(commandNameB)
		)
		.map(
			([commandName, commandData]) =>
				`• \`${commandName}\` — ${commandData.description}`
		)
		.join('\n')

	const content = mustache.render(locale.commands.help.title, {
		commandList: sortedCommandList,
	})

	return { content }
}
