import mustache from 'mustache'
import serverLocaleShema from '../../../schemas/serverLocale.js'
import { getLanguageFlag } from '../../../utils/general/getLanguageFlag.js'
import { getLanguageName } from '../../../utils/general/getLanguageName.js'
import { getLocalizedText } from '../../../utils/general/getLocale.js'

export const handleSetupLocale = async (interaction, options) => {
	await interaction.deferReply({ flags: 64 })

	const { guild } = interaction
	const selectedLocale = options.language
	await serverLocaleShema.updateOne(
		{ Guild: guild.id },
		{ $set: { Language: selectedLocale } },
		{ upsert: true }
	)

	const locale = await getLocalizedText(interaction)
	const content = mustache.render(locale.commands.language.updated, {
		flag: getLanguageFlag(selectedLocale),
		language: getLanguageName(selectedLocale),
	})

	return { content }
}
