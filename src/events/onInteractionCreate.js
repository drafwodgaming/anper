import { Events } from 'discord.js'

export default {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		const { customId } = interaction
		const { modals, buttons, selectMenus, commands } = client
		const isChatInputCommand = interaction.isChatInputCommand()
		const isModalSubmit = interaction.isModalSubmit()
		const isButton = interaction.isButton()
		const isStringSelectMenu = interaction.isAnySelectMenu()

		switch (true) {
			case isChatInputCommand: {
				const command = commands.get(interaction.commandName)
				if (!command) return

				await command.execute(interaction, client)
				break
			}

			case isModalSubmit: {
				const modal = modals.get(customId)
				if (modal) await modal.execute(interaction, client)
				break
			}

			case isButton: {
				const button = buttons.get(customId)
				if (button) await button.execute(interaction, client)
				break
			}

			case isStringSelectMenu: {
				const selectMenu = selectMenus.get(customId)
				if (selectMenu) await selectMenu.execute(interaction, client)

				for (const row of interaction.message.components) {
					for (const component of row.components) {
						component.selected_values = []
					}
				}
				try {
					await interaction.message.edit({
						components: interaction.message.components,
					})
				} catch {
					return
				}
				break
			}
		}
	},
}
