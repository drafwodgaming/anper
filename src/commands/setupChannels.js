import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = new SlashCommandBuilder()
	.setName('channels')
	.setDescription('Select channels')
	.setDescriptionLocalizations({
		ru: 'Настройка каналов',
		uk: 'Налаштування каналів',
	})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand =>
		subcommand
			.setName('setup')
			.setDescription('Setup channels')
			.setDescriptionLocalizations({
				ru: 'Настройка каналов',
				uk: 'Налаштування каналів',
			})
	)
	.setContexts('Guild')

export default async interaction => {
	await interaction.deferReply({ flags: 64 })

	const subCommand = interaction.options.getSubcommand()
	const locale = await getLocalizedText(interaction)

	switch (subCommand) {
		case 'setup': {
			const content = `${locale.components.setupDescription.title}\n${locale.components.setupDescription.text}`

			const selectsData = [
				{
					customId: 'chooseWelcomeChannel',
					placeholder: locale.components.menus.welcomeChannelSelect.placeholder,
					channelType: ChannelType.GuildText,
				},
				{
					customId: 'chooseLeaveChannel',
					placeholder: locale.components.menus.leaveChannelSelect.placeholder,
					channelType: ChannelType.GuildText,
				},
				{
					customId: 'chooseVoiceHubChannel',
					placeholder: locale.components.menus.JTCSystemChannelSelect.placeholder,
					channelType: ChannelType.GuildVoice,
				},
			]

			const components = selectsData.map(
				({ customId, placeholder, channelType }) =>
					new ActionRowBuilder().addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId(customId)
							.setPlaceholder(placeholder)
							.setChannelTypes([channelType])
							.setMaxValues(1)
					)
			)

			return interaction.editReply({ content, components })
		}
	}
}
