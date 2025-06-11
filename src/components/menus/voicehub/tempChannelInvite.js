import { getLocalizedText } from '../../../utils/general/getLocale.js'

export default {
	data: { name: 'inviteUser' },
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const messages = locale.components.menus.voiceHub
		const selectedUserId = interaction.values[0]
		let content

		try {
			const selectedUser = await interaction.guild.members.fetch(selectedUserId)
			await selectedUser.send({
				content: `You have been invited to join the channel: ${interaction.channel.url}`,
			})

			content = messages.channelInvite.inviteSuccess
		} catch (error) {
			content = messages.channelInvite.inviteError
		}

		await interaction.update({ content, components: [], flags: 64 })
	},
}
