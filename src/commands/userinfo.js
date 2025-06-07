import { Profile } from 'discord-arts'
import { AttachmentBuilder } from 'discord.js'
import mustache from 'mustache'
import { getStatusText } from '../modules/commands/userinfo/getStatusText.js'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = {
	description: 'View information about the user',
	descriptionLocalizations: {
		ru: 'Показать информацию о пользователе',
		uk: 'Показати інформацію про користувача',
	},
	options: [
		{
			name: 'user',
			description: 'User',
			descriptionLocalizations: {
				ru: 'Пользователь',
				uk: 'Користувач',
			},
			type: 'user',
			required: false,
		},
	],
}

export default async (interaction, options) => {
	const locale = await getLocalizedText(interaction)
	const message = locale.commands.userInfo

	const defaultBotColor = getColor('white', '0x')

	const targetUser = options.user || interaction.user
	const targetMember = await interaction.guild.members.fetch(targetUser.id)

	const profileImageBuffer = await Profile(targetUser.id, {
		badgesFrame: true,
	})

	const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
		name: 'profile.png',
	})

	const userCreatedAt = targetUser.createdAt
	const memberJoinedTime = targetMember.joinedAt

	const userRoles = targetMember?.roles.cache
		.filter(role => role.id !== interaction.guild.roles.everyone.id)
		.map(role => `<@&${role.id}>`)
		.slice(0, 3)
		.join(', ')
	const userRolesCount = targetMember?.roles.cache.size || 0

	const presenceStatus = targetMember?.presence?.status || 'offline'
	const statusText = getStatusText(presenceStatus, locale)

	const userInfoEmbed = {
		color: defaultBotColor,
		title: locale.commands.userInfo.title,
		image: { url: 'attachment://profile.png' },
		timestamp: new Date(),
		fields: [
			{
				name: message.createdAt,
				value: mustache.render(message.createdTime, {
					userCreatedAt: `<t:${Math.floor(userCreatedAt / 1000)}:R>`,
				}),
				inline: true,
			},
			{
				name: message.joinedAt,
				value: mustache.render(message.joinedTime, {
					memberJoinedTime: `<t:${Math.floor(memberJoinedTime / 1000)}:R>`,
				}),
				inline: true,
			},
			{
				name: message.memberRoles,
				value: userRolesCount > 0 ? userRoles : message.emptyRolesList,
			},
			{
				name: message.statusLabel,
				value: statusText,
				inline: true,
			},
		],
	}

	await new Promise(resolve => setTimeout(resolve, 3000))
	return {
		embeds: [userInfoEmbed],
		files: [imageAttachment],
	}
}
