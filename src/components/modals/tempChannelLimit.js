import voiceTempChannelSchema from '../../schemas/voiceTempChannel.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const customID = 'tempChannelLimit'

export default async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)
	const message = locale.components.modals.channelLimit

	const limitInput = interaction.fields.getTextInputValue(
		'tempChannelLimitInput'
	)
	const limit = parseInt(limitInput)

	if (isNaN(limit) || limit < 0 || limit > 99)
		return await interaction.editReply({
			content: message.invalidLimit,
		})

	const userLimit = limit === 0 ? 99 : limit

	await voiceTempChannelSchema.findOneAndUpdate(
		{ Guild: interaction.guild.id, ChannelId: interaction.channel.id },
		{ $set: { Limit: userLimit } },
		{ upsert: true }
	)

	await interaction.channel.setUserLimit(userLimit)
	await interaction.editReply(message.successMessage)
}
