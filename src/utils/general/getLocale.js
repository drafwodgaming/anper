import locale from '../../schemas/serverLocale.js'
import { getGuildLanguage } from './getGuildLanguage.js'

const getLocalizedText = async ({ guild, user, mode = 'text' }) => {
	const id = guild?.id || user?.id
	const lang = (await getGuildLanguage(id, locale)) || 'en'

	if (mode === 'behavior') {
		switch (lang) {
			case 'ru':
				return {
					api: 'shikimori',
					site: 'shikimori.one',
					isRTL: false,
					defaults: { description: 'Описание отсутствует' },
				}
			case 'en':
			default:
				return {
					api: 'jikan',
					site: 'myanimelist.net',
					isRTL: false,
					defaults: { description: 'No description available' },
				}
		}
	}

	return global.languages[lang] || global.languages['en']
}

export { getLocalizedText }
