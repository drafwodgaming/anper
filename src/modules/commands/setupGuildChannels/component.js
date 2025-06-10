// modules/commands/setupChannels/menus.js
import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
} from 'discord.js'

export const createChannelSelectMenus = locale => {
	const selectsData = [
		{
			customId: 'chooseWelcomeChannel',
			placeholder: locale.components.menus.welcomeChannelSelect.placeholder,
			channelType: ChannelType.GuildText,
		},
		{
			customId: 'chooseLeaveChannel',
			placeholder: locale.components.menus.leaveChannelSelect.placeholder,
			channelType: ChannelType.GuildText,
		},
		{
			customId: 'chooseVoiceHubChannel',
			placeholder: locale.components.menus.JTCSystemChannelSelect.placeholder,
			channelType: ChannelType.GuildVoice,
		},
	]

	return selectsData.map(({ customId, placeholder, channelType }) => {
		const menu = new ChannelSelectMenuBuilder()
			.setCustomId(customId)
			.setPlaceholder(placeholder)
			.setChannelTypes(channelType)
			.setMaxValues(1)

		return new ActionRowBuilder().addComponents(menu)
	})
}
