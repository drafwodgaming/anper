import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const customID = 'channelSettings'

export default async interaction => {
	const locale = await getLocalizedText(interaction)
	const message = locale.components.modals

	const selectedAction = interaction.values[0]

	switch (selectedAction) {
		case 'channelName': {
			const tempChannelName = new ModalBuilder()
				.setTitle(message.channelName.title)
				.setCustomId('tempChannelName')

			const inputField = new TextInputBuilder()
				.setCustomId('tempChannelNameInput')
				.setPlaceholder(message.channelName.exampleName)
				.setLabel(message.channelName.label)
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const row = new ActionRowBuilder().addComponents(inputField)
			tempChannelName.addComponents(row)

			await interaction.showModal(tempChannelName)
			break
		}
		case 'channelLimit': {
			const limitModal = new ModalBuilder()
				.setTitle(message.channelLimit.title)
				.setCustomId('tempChannelLimit')

			const limitInput = new TextInputBuilder()
				.setCustomId('tempChannelLimitInput')
				.setPlaceholder(message.channelLimit.exampleName)
				.setLabel(message.channelLimit.label)
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const row = new ActionRowBuilder().addComponents(limitInput)
			limitModal.addComponents(row)

			await interaction.showModal(limitModal)
		}
	}
}
