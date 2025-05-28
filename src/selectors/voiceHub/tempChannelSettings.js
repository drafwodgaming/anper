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
	const message = locale.components.modals.channelName

	const selectedAction = interaction.values[0]

	switch (selectedAction) {
		case 'channelName':
			const tempChannelName = new ModalBuilder()
				.setTitle(message.title)
				.setCustomId('tempChannelName')

			const inputField = new TextInputBuilder()
				.setCustomId('tempChannelNameInput')
				.setPlaceholder(message.exampleName)
				.setLabel(message.label)
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const row = new ActionRowBuilder().addComponents(inputField)
			tempChannelName.addComponents(row)

			await interaction.showModal(tempChannelName)
	}
}
