import { SlashCommandBuilder } from 'discord.js'
import { buildEmbedFromAnime } from '../utils/anime/embed/buildEmbedFromAnime.js'
import { fetchAnimeData } from '../utils/anime/fetchData.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

const config = new SlashCommandBuilder()
	.setName('anime')
	.setDescription('[BETA] Search anime by name (experimental feature)')
	.setDescriptionLocalizations({
		ru: '[BETA] Поиск аниме по названию (экспериментальная функция)',
		uk: '[BETA] Пошук аніме за назвою (експериментальна функція)',
	})
	.addStringOption(option =>
		option
			.setName('name')
			.setDescription('Enter the anime title')
			.setDescriptionLocalizations({
				ru: 'Введите название аниме',
				uk: 'Введіть назву аніме',
			})
			.setRequired(true)
			.setAutocomplete(true)
	)

export const autocomplete = async interaction => {
	const focused = interaction.options.getFocused()
	const { api } = await getLocalizedText({
		guild: interaction.guild,
		mode: 'behavior',
	})

	const baseUrls = {
		shikimori: focused
			? `https://shikimori.one/api/animes?search=${encodeURIComponent(
					focused
			  )}&limit=10`
			: `https://shikimori.one/api/animes?order=popularity&limit=10`,
		jikan: focused
			? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(focused)}&limit=10`
			: `https://api.jikan.moe/v4/top/anime?limit=10`,
	}

	try {
		const data = await fetchAnimeData(
			baseUrls[api],
			api === 'shikimori' ? { 'User-Agent': 'DiscordBot/1.0 (drafwod)' } : {}
		)

		const list = Array.isArray(data) ? data.slice(0, 10) : []
		const choices = list.map(anime => ({
			name: api === 'shikimori' ? anime.russian : anime.title,
			value: (anime.id || anime.mal_id)?.toString(),
		}))

		await interaction.respond(choices)
	} catch {
		await interaction.respond([])
	}
}

export const execute = async interaction => {
	await interaction.deferReply()

	const animeId = interaction.options.getString('name')
	const { api } = await getLocalizedText({
		guild: interaction.guild,
		mode: 'behavior',
	})

	const apiUrl =
		api === 'shikimori'
			? `https://shikimori.one/api/animes/${animeId}`
			: `https://api.jikan.moe/v4/anime/${animeId}`

	try {
		const anime = await fetchAnimeData(
			apiUrl,
			api === 'shikimori' ? { 'User-Agent': 'DiscordBot/1.0 (drafwod)' } : {}
		)

		const embed = buildEmbedFromAnime(api, anime)
		await interaction.editReply({ embeds: [embed] })
	} catch {
		await interaction.editReply('❌ Не удалось получить данные об аниме.')
	}
}

export default { config, autocomplete, execute }
