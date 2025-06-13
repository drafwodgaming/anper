import { getFieldValue } from './getFieldValue.js'

export const buildFields = (isShiki, anime) => [
	{
		name: isShiki ? 'Жанры' : 'Genres',
		value:
			anime.genres?.map(g => g.name).join(', ') ||
			(isShiki ? 'Нет данных' : 'N/A'),
		inline: true,
	},
	{
		name: isShiki ? 'Эпизоды' : 'Episodes',
		value: getFieldValue(
			anime.episodes,
			isShiki,
			isShiki ? 'Неизвестно' : 'Unknown'
		),
		inline: true,
	},
	{
		name: isShiki ? 'Оценка' : 'Score',
		value: getFieldValue(anime.score, isShiki, isShiki ? 'Нет' : 'N/A'),
		inline: true,
	},
]
