import { bold, ChannelType, SlashCommandBuilder } from 'discord.js'
import mustache from 'mustache'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export default {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('View information about the server')
		.setDescriptionLocalizations({
			ru: 'Показать общую информацию о сервере',
			uk: 'Показати загальну інформацію про сервер',
		})
		.setContexts('Guild'),
	async execute(interaction) {
		await interaction.deferReply()

		const locale = await getLocalizedText(interaction)

		const { guild } = interaction
		const { name: guildName, id: guildId, description } = guild
		const { members, roles, channels } = guild
		const { ownerId, createdTimestamp } = guild

		const guildIconURL = guild.iconURL()
		const guildDescription =
			description || locale.commands.serverInfo.noDescription

		const defaultBotColor = getColor('white', '0x')

		const totalMembersCount = members.cache.size
		const nonBotMembersCount = members.cache.filter(
			member => !member.user.bot
		).size
		const botMembersCount = totalMembersCount - nonBotMembersCount

		const channelCounts = {
			total: 0,
			categories: 0,
			text: 0,
			voice: 0,
			stage: 0,
			forum: 0,
		}

		channels.cache.forEach(channel => {
			channelCounts.total++
			switch (channel.type) {
				case ChannelType.GuildCategory:
					channelCounts.categories++
					break
				case ChannelType.GuildText:
					channelCounts.text++
					break
				case ChannelType.GuildVoice:
					channelCounts.voice++
					break
				case ChannelType.GuildStageVoice:
					channelCounts.stage++
					break
				case ChannelType.GuildForum:
					channelCounts.forum++
					break
			}
		})

		const totalEmojisCount = guild.emojis.cache.size
		const animatedEmojisCount = guild.emojis.cache.filter(
			emoji => emoji.animated
		).size
		const staticEmojisCount = totalEmojisCount - animatedEmojisCount

		const totalRolesCount = roles.cache.size
		const maxRolesDisplay = 15
		const displayedRoles = roles.cache
			.map(role => role)
			.slice(0, maxRolesDisplay)
			.join(' ')

		const serverInfoEmbed = {
			color: defaultBotColor,
			description: bold(guildDescription),
			fields: [
				{
					name: locale.commands.serverInfo.generalLabel,
					value: [
						mustache.render(locale.commands.serverInfo.guildOwnerId, { ownerId }),
						mustache.render(locale.commands.serverInfo.createdAt, {
							guildCreatedAt: `<t:${Math.floor(createdTimestamp / 1000)}:R>`,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalMembersCount, {
						totalMembersCount,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.guildMembersCount, {
							nonBotMembersCount,
						}),
						mustache.render(locale.commands.serverInfo.guildBotsCount, {
							botMembersCount,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalChannelsCount, {
						totalChannels: channelCounts.total,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.textChannelsCount, {
							textChannelsIco: global.emojis.textChannel,
							textChannels: channelCounts.text,
						}),
						mustache.render(locale.commands.serverInfo.voiceChannelsCount, {
							voiceChannelsIco: global.emojis.voiceChannel,
							voiceChannels: channelCounts.voice,
						}),
						mustache.render(locale.commands.serverInfo.categoriesCount, {
							categoriesIco: global.emojis.category,
							categoryChannels: channelCounts.categories,
						}),
						mustache.render(locale.commands.serverInfo.stageChannelsCount, {
							stageChannelsIco: global.emojis.stage,
							stageChannels: channelCounts.stage,
						}),
						mustache.render(locale.commands.serverInfo.forumsCount, {
							forumsIco: global.emojis.forum,
							forumChannels: channelCounts.forum,
						}),
					].join(' | '),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalEmojisCount, {
						totalEmojisCount,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.animatedEmojisCount, {
							animatedEmojisCount,
						}),
						mustache.render(locale.commands.serverInfo.staticEmojisCount, {
							staticEmojisCount,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.guildRolesCount, {
						totalRolesCount,
					}),
					value: displayedRoles,
				},
			],
			thumbnail: { url: guildIconURL },
			author: { name: guildName, iconURL: guildIconURL },
			footer: { text: locale.commands.tag },
			timestamp: new Date(),
		}

		return await interaction.editReply({ embeds: [serverInfoEmbed] })
	},
}
