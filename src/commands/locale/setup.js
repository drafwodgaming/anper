import { PermissionFlagsBits } from 'discord.js'
import mustache from 'mustache'
import serverLocaleShema from '../../schemas/serverLocale.js'
import { getLanguageFlag } from '../../utils/general/getLanguageFlag.js'
import { getLanguageName } from '../../utils/general/getLanguageName.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const config = {
	description: 'Set language',
	descriptionLocalizations: {
		ru: 'Установить язык для сервера',
		uk: 'Налаштувати мову для сервера',
	},
	defaultMemberPermissions: PermissionFlagsBits.Administrator,
	options: [
		{
			name: 'language',
			description: 'Choose Language',
			descriptionLocalizations: {
				ru: 'Выбрать язык',
				uk: 'Вибрати мову',
			},
			type: 'string',
			required: true,
			choices: [
				{ name: 'English', value: 'en' },
				{ name: 'Русский', value: 'ru' },
				{ name: 'Українська', value: 'uk' },
			],
		},
	],
}

export default async (interaction, options) => {
	const { guild } = interaction
	const selectedLocale = options.language
	await serverLocaleShema.updateOne(
		{ Guild: guild.id },
		{ $set: { Language: selectedLocale } },
		{ upsert: true }
	)

	const locale = await getLocalizedText(interaction)
	const localizedMessage = mustache.render(locale.commands.language.updated, {
		flag: getLanguageFlag(selectedLocale),
		language: getLanguageName(selectedLocale),
	})

	return { content: localizedMessage, flags: 64 }
}
