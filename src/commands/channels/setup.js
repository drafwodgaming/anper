import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	PermissionFlagsBits,
} from 'discord.js'
import { createCommandConfig } from 'robo.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const config = createCommandConfig({
	description: 'Channels setup',
	descriptionLocalizations: {
		ru: 'Настройка каналов',
		uk: 'Налаштування каналів',
	},
	defaultMemberPermissions: PermissionFlagsBits.Administrator,
})

export default async interaction => {
	const { components: locale } = await getLocalizedText(interaction)

	// 📦 Вынесенные билдеры для каждого селектора
	const welcomeChannelSelect = new ChannelSelectMenuBuilder()
		.setCustomId('chooseWelcomeChannel')
		.setPlaceholder(locale.menus.welcomeChannelSelect.placeholder)
		.setChannelTypes(ChannelType.GuildText)
		.setMaxValues(1)

	const leaveChannelSelect = new ChannelSelectMenuBuilder()
		.setCustomId('chooseLeaveChannel')
		.setPlaceholder(locale.menus.leaveChannelSelect.placeholder)
		.setChannelTypes(ChannelType.GuildText)
		.setMaxValues(1)

	const voiceHubChannelSelect = new ChannelSelectMenuBuilder()
		.setCustomId('chooseVoiceHubChannel')
		.setPlaceholder(locale.menus.JTCSystemChannelSelect.placeholder)
		.setChannelTypes(ChannelType.GuildVoice)
		.setMaxValues(1)

	// 📐 ActionRow контейнеры
	const welcomeChannelRow = new ActionRowBuilder().addComponents(
		welcomeChannelSelect
	)
	const leaveChannelRow = new ActionRowBuilder().addComponents(
		leaveChannelSelect
	)
	const voiceHubChannelRow = new ActionRowBuilder().addComponents(
		voiceHubChannelSelect
	)

	const components = [welcomeChannelRow, leaveChannelRow, voiceHubChannelRow]

	const description = [
		locale.setupDescription.title,
		locale.setupDescription.text,
		...locale.setupDescription.options,
	].join('\n')

	return { content: description, components, flags: 64 }
}
