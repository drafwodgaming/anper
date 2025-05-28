import leaveChannelSchema from '../schemas/leaveChannel.js'
import serverlocaleSchema from '../schemas/serverLocale.js'
import voiceHubCreatorSchema from '../schemas/voiceHubCreator.js'
import welcomeChannelSchema from '../schemas/welcomeChannel.js'

export default async guild => {
	console.log(`Left guild ${guild.name} with ${guild.memberCount} members!`)

	const guildId = guild.id

	try {
		// Запросы к разным коллекциям
		const [voiceHubData, leaveChannelData, serverlocaleData, welcomeChannelData] =
			await Promise.all([
				voiceHubCreatorSchema.find({ Guild: guildId }),
				leaveChannelSchema.find({ Guild: guildId }),
				serverlocaleSchema.find({ Guild: guildId }),
				welcomeChannelSchema.find({ Guild: guildId }),
			])

		// Если нужны данные для удаления
		if (voiceHubData.length)
			await voiceHubCreatorSchema.deleteMany({ Guild: guildId })
		if (leaveChannelData.length)
			await leaveChannelSchema.deleteMany({ Guild: guildId })
		if (serverlocaleData.length)
			await serverlocaleSchema.deleteMany({ Guild: guildId })
		if (welcomeChannelData.length)
			await welcomeChannelSchema.deleteMany({ Guild: guildId })

		// Возвращаем или обрабатываем данные
		return {
			voiceHubData,
			leaveChannelData,
			serverlocaleData,
			welcomeChannelData,
		}
	} catch (error) {
		console.error('Ошибка при получении данных по guildId:', error)
		return { content: 'Произошла ошибка при обработке данных.' }
	}
}
