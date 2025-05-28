import locale from '../../schemas/serverLocale.js'
import { getGuildLanguage } from './getGuildLanguage.js'

const getLocalizedText = async ({ guild, user }) =>
	global.languages[await getGuildLanguage(guild?.id || user?.id, locale)] ||
	global.languages['en']

export { getLocalizedText }
