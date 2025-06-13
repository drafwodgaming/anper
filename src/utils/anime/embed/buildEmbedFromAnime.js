import { getColor } from '../../../utils/general/getColor.js'
import { buildFields } from './buildFields.js'
import { buildImageUrl } from './buildImageUrl.js'
import { buildUrl } from './buildUrl.js'
import { getDescription } from './getDescription.js'
import { getTitle } from './getTitle.js'
export const buildEmbedFromAnime = (api, anime) => {
	const isShiki = api === 'shikimori'
	const defaultBotColor = getColor('white', '0x')

	return {
		title: getTitle(isShiki, anime),
		description: getDescription(isShiki, anime),
		color: defaultBotColor,
		url: buildUrl(isShiki, anime.url),
		image: (() => {
			const imgUrl = buildImageUrl(isShiki, anime)
			return imgUrl ? { url: imgUrl } : undefined
		})(),
		fields: buildFields(isShiki, anime),
		footer: { text: '🧪 B E T A' },
	}
}
