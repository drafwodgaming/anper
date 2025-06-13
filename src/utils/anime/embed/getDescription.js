import { parseCharacterTags } from '../parseCharacterTags.js'

export const getDescription = (isShiki, anime) => {
	const raw = isShiki ? anime.description : anime.synopsis || ''
	const clean = isShiki ? parseCharacterTags(raw.replace(/<[^>]+>/g, '')) : raw
	return clean.slice(0, 2048)
}
