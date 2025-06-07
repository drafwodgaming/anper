import { ChannelType, bold } from 'discord.js'
import mustache from 'mustache'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = {
	description: 'View information about the server',
	descriptionLocalizations: {
		ru: 'Показать общую информацию о сервере',
		uk: 'Показати загальну інформацію про сервер',
	},
}

export default async interaction => {
	const locale = await getLocalizedText(interaction)
	const message = locale.commands.serverInfo

	const { guild } = interaction
	const { name: guildName, id: guildId, description } = guild
	const { members, roles, channels } = guild
	const { ownerId, createdTimestamp } = guild

	const defaultBotColor = getColor('white', '0x')

	const totalMembersCount = members.cache.size
	const nonBotMembersCount = members.cache.filter(
		member => !member.user.bot
	).size
	const botMembersCount = totalMembersCount - nonBotMembersCount

	let totalChannels = 0
	let categoryChannels = 0
	let textChannels = 0
	let voiceChannels = 0
	let stageChannels = 0
	let forumChannels = 0

	channels.cache.forEach(channel => {
		totalChannels++
		switch (channel.type) {
			case ChannelType.GuildCategory:
				categoryChannels++
				break
			case ChannelType.GuildText:
				textChannels++
				break
			case ChannelType.GuildVoice:
				voiceChannels++
				break
			case ChannelType.GuildStageVoice:
				stageChannels++
				break
			case ChannelType.GuildForum:
				forumChannels++
				break
		}
	})

	const totalEmojisCount = guild.emojis.cache.size
	let animatedEmojisCount = 0
	guild.emojis.cache.forEach(emoji => {
		if (emoji.animated) animatedEmojisCount++
	})
	const staticEmojisCount = totalEmojisCount - animatedEmojisCount

	const totalRolesCount = roles.cache.size
	const maxRolesDisplay = 15
	const displayedRoles = roles.cache
		.map(role => role)
		.slice(0, maxRolesDisplay)
		.join(' ')

	const guildDescription = description || message.noDescription

	const serverInfoEmbed = {
		color: defaultBotColor,
		description: bold(guildDescription),
		fields: [
			{
				name: message.generalLabel,
				value: [
					mustache.render(message.guildOwnerId, { ownerId }),
					mustache.render(message.createdAt, {
						guildCreatedAt: `<t:${Math.floor(createdTimestamp / 1000)}:R>`,
					}),
				].join('\n'),
			},
			{
				name: mustache.render(message.totalMembersCount, {
					totalMembersCount,
				}),
				value: [
					mustache.render(message.guildMembersCount, {
						nonBotMembersCount,
					}),
					mustache.render(message.guildBotsCount, {
						botMembersCount,
					}),
				].join('\n'),
			},
			{
				name: mustache.render(message.totalChannelsCount, {
					totalChannels,
				}),
				value: [
					mustache.render(message.textChannelsCount, {
						textChannelsIco: global.emojis.textChannel,
						textChannels,
					}),
					mustache.render(message.voiceChannelsCount, {
						voiceChannelsIco: global.emojis.voiceChannel,
						voiceChannels,
					}),
					mustache.render(message.categoriesCount, {
						categoriesIco: global.emojis.category,
						categoryChannels,
					}),
					mustache.render(message.stageChannelsCount, {
						stageChannelsIco: global.emojis.stage,
						stageChannels,
					}),
					mustache.render(message.forumsCount, {
						forumsIco: global.emojis.forum,
						forumChannels,
					}),
				].join(' | '),
			},
			{
				name: mustache.render(message.totalEmojisCount, {
					totalEmojisCount,
				}),
				value: [
					mustache.render(message.animatedEmojisCount, {
						animatedEmojisCount,
					}),
					mustache.render(message.staticEmojisCount, {
						staticEmojisCount,
					}),
				].join('\n'),
			},
			{
				name: mustache.render(message.guildRolesCount, {
					totalRolesCount,
				}),
				value: displayedRoles,
			},
		],
		thumbnail: { url: guild.iconURL() },
		author: { name: guildName, iconURL: guild.iconURL() },
		footer: { text: guildId },
		timestamp: new Date(),
	}

	return { embeds: [serverInfoEmbed] }
}
