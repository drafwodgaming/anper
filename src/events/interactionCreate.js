import {
	ButtonHandlers,
	ModalHandlers,
	SelectorHandlers,
} from './_start/interactionHandler.js'

export default async interaction => {
	switch (true) {
		case interaction.isButton(): {
			ButtonHandlers.get(interaction.customId)?.(interaction)
			break
		}

		case interaction.isModalSubmit(): {
			ModalHandlers.get(interaction.customId)?.(interaction)
			break
		}

		case interaction.isAnySelectMenu(): {
			SelectorHandlers.get(interaction.customId)?.(interaction)

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
}
