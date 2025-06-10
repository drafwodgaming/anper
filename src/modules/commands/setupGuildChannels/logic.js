import { getLocalizedText } from '../../../utils/general/getLocale.js'
import { createChannelSelectMenus } from './component.js'

export const handleSetupChannels = async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)
	const content = `${locale.components.setupDescription.title}\n${locale.components.setupDescription.text}`
	const components = createChannelSelectMenus(locale)

	return { content, components }
}
