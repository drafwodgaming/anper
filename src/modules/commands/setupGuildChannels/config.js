import { PermissionFlagsBits } from 'discord.js'

export const channelSetupConfig = {
	description: 'Channels setup',
	descriptionLocalizations: {
		ru: 'Настройка каналов',
		uk: 'Налаштування каналів',
	},
	defaultMemberPermissions: PermissionFlagsBits.Administrator,
}
