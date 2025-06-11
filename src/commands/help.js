import { SlashCommandBuilder, bold } from 'discord.js'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Get the list of commands for the bot')
	.setDescriptionLocalizations({
		ru: 'Отобразить список команд бота',
		uk: 'Показати список команд бота',
	})
	.setContexts('Guild', 'BotDM')

export default async (interaction, client) => {
	const locale = await getLocalizedText(interaction)
	const defaultBotColor = getColor('white', '0x')

	const embed = {
		color: defaultBotColor,
		title: locale.commands.help.title,
		fields: client.commandsArray.map(({ name, description }) => ({
			name: bold(name),
			value: description,
			inline: true,
		})),
	}

	await interaction.reply({ embeds: [embed], flags: 64 })
}
