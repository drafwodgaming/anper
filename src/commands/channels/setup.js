import { ChannelType, ComponentType, PermissionFlagsBits } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import { createComponentsFromSchema } from '../../utils/componentBuilder.js'
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

	const channelSchemas = {
		welcomeChannel: {
			type: ComponentType.ActionRow,
			components: [
				{
					type: ComponentType.ChannelSelect,
					custom_id: 'chooseWelcomeChannel',
					placeholder: locale.menus.welcomeChannelSelect.placeholder,
					channel_types: [ChannelType.GuildText],
					max_values: 1,
				},
			],
		},
		leaveChannel: {
			type: ComponentType.ActionRow,
			components: [
				{
					type: ComponentType.ChannelSelect,
					custom_id: 'chooseLeaveChannel',
					placeholder: locale.menus.leaveChannelSelect.placeholder,
					channel_types: [ChannelType.GuildText],
					max_values: 1,
				},
			],
		},
		voiceHubChannel: {
			type: ComponentType.ActionRow,
			components: [
				{
					type: ComponentType.ChannelSelect,
					custom_id: 'chooseVoiceHubChannel',
					placeholder: locale.menus.JTCSystemChannelSelect.placeholder,
					channel_types: [ChannelType.GuildVoice],
					max_values: 1,
				},
			],
		},
	}

	const components = createComponentsFromSchema(Object.values(channelSchemas))

	const description = [
		locale.setupDescription.title,
		locale.setupDescription.text,
		...locale.setupDescription.options,
	].join('\n')

	return { content: description, components, flags: 64 }
}
