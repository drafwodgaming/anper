import { ActionRowBuilder, Events, StringSelectMenuBuilder } from 'discord.js'
import voiceHubCreatorSchema from '../schemas/voiceHubCreator.js'
import voiceTempChannelSchema from '../schemas/voiceTempChannel.js'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'
import { createVoiceChannel } from '../utils/voiceHub/createVoiceChannel.js'

export default {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const locale = await getLocalizedText(newState.member)

		if (oldState.channelId === newState.channelId) return

		const defaultBotColor = getColor('white', '0x')
		const messageEmbed = locale.events.voiceHub
		const messageSelector = locale.components.menus.voiceHub

		if (!oldState.channel && newState.channel) {
			const voiceHubData = await voiceHubCreatorSchema
				.findOne({ Guild: newState.guild.id })
				.lean()

			if (!voiceHubData || newState.channel.id !== voiceHubData.Channel) return

			const parentCategory = newState.channel.parent
			const channel = await createVoiceChannel(
				newState.guild,
				newState.member,
				parentCategory
			)

			await voiceTempChannelSchema.create({
				Guild: newState.guild.id,
				ChannelId: channel.id,
				Creator: newState.member.id,
				ChannelName: channel.name,
				Limit: channel.userLimit,
			})

			const embed = {
				color: defaultBotColor,
				title: messageEmbed.title,
				description: `${messageEmbed.customizeDescription} 
			${messageEmbed.importantInfoDescription}`,
				footer: { text: 'Anper Voice Interface' },
			}

			const channelSettings = new StringSelectMenuBuilder()
				.setCustomId('channelSettings')
				.setPlaceholder(messageSelector.channelSettings.placeholder)
				.setOptions([
					{
						label: messageSelector.channelSettings.options.nameLabel,
						description: messageSelector.channelSettings.options.nameDescription,
						value: 'channelName',
						emoji: global.emojis.nameTag,
					},
					{
						label: messageSelector.channelSettings.options.limitLabel,
						description: messageSelector.channelSettings.options.limitDescription,
						value: 'channelLimit',
						emoji: global.emojis.limitPeople,
					},
				])

			const channelPermission = new StringSelectMenuBuilder()
				.setCustomId('channelPermission')
				.setPlaceholder(messageSelector.channelPermissions.placeholder)
				.setOptions([
					{
						label: messageSelector.channelPermissions.options.lockChannelLabel,
						description:
							messageSelector.channelPermissions.options.lockChannelDescription,
						value: 'channelLock',
						emoji: global.emojis.lockChannel,
					},
					{
						label: messageSelector.channelPermissions.options.unlockChannelLabel,
						description:
							messageSelector.channelPermissions.options.unlockChannelDescription,
						value: 'channelUnlock',
						emoji: global.emojis.unlockChannel,
					},
					{
						label: messageSelector.channelInvite.options.inviteLabel,
						description: messageSelector.channelInvite.options.inviteDescription,
						value: 'channelInvite',
						emoji: global.emojis.invite,
					},
				])
				.setMaxValues(1)

			const channelSettingsRow = new ActionRowBuilder().addComponents(
				channelSettings
			)

			const channelPermissionRow = new ActionRowBuilder().addComponents(
				channelPermission
			)

			await channel.send({
				embeds: [embed],
				components: [channelSettingsRow, channelPermissionRow],
			})

			await newState.setChannel(channel).catch(() => {})
		}

		if (oldState.channel && !newState.channel) {
			const voiceTempChannelData = await voiceTempChannelSchema.findOne({
				ChannelId: oldState.channel.id,
			})
			if (!voiceTempChannelData) return

			const channel = oldState.guild.channels.resolve(oldState.channel.id)

			if (channel && channel.members.size === 0) {
				await voiceTempChannelData.deleteOne({ ChannelId: oldState.channel.id })
				await channel.delete().catch(() => {})
			}
		}
	},
}
