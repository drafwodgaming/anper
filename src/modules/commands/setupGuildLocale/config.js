import { PermissionFlagsBits } from 'discord.js'

export const localeSetupConfig = {
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
