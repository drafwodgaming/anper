import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ChannelType,
	ComponentType,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from 'discord.js'

/**
 * @param {Array} componentSchema
 * @returns {Array<ActionRowBuilder>}
 */
export function createComponentsFromSchema(componentSchema) {
	return componentSchema.map(({ components }) => {
		const row = new ActionRowBuilder()
		for (const config of components) {
			row.addComponents(buildComponent(config))
		}
		return row
	})
}

const defaultOptions = {
	min_values: 1,
	max_values: 1,
	disabled: false,
	required: true,
	placeholder: '',
	label: '',
	emoji: null,
}

const componentBuilders = {
	[ComponentType.Button]: config =>
		new ButtonBuilder()
			.setCustomId(config.custom_id)
			.setLabel(config.label ?? defaultOptions.label)
			.setStyle(config.style ?? ButtonStyle.Primary)
			.setEmoji(config.emoji ?? defaultOptions.emoji)
			.setDisabled(config.disabled ?? defaultOptions.disabled),

	[ComponentType.StringSelect]: config =>
		new StringSelectMenuBuilder()
			.setCustomId(config.custom_id)
			.setPlaceholder(config.placeholder ?? defaultOptions.placeholder)
			.setMinValues(config.min_values ?? defaultOptions.min_values)
			.setMaxValues(config.max_values ?? defaultOptions.max_values)
			.addOptions(...config.options),

	[ComponentType.ChannelSelect]: config =>
		new ChannelSelectMenuBuilder()
			.setCustomId(config.custom_id)
			.setPlaceholder(config.placeholder ?? defaultOptions.placeholder)
			.setChannelTypes(config.channel_types ?? [ChannelType.GuildText])
			.setMinValues(config.min_values ?? defaultOptions.min_values)
			.setMaxValues(config.max_values ?? defaultOptions.max_values),

	[ComponentType.RoleSelect]: config =>
		new RoleSelectMenuBuilder()
			.setCustomId(config.custom_id)
			.setPlaceholder(config.placeholder ?? defaultOptions.placeholder)
			.setMinValues(config.min_values ?? defaultOptions.min_values)
			.setMaxValues(config.max_values ?? defaultOptions.max_values),

	[ComponentType.UserSelect]: config =>
		new UserSelectMenuBuilder()
			.setCustomId(config.custom_id)
			.setPlaceholder(config.placeholder ?? defaultOptions.placeholder)
			.setMinValues(config.min_values ?? defaultOptions.min_values)
			.setMaxValues(config.max_values ?? defaultOptions.max_values),

	[ComponentType.MentionableSelect]: config =>
		new MentionableSelectMenuBuilder()
			.setCustomId(config.custom_id)
			.setPlaceholder(config.placeholder ?? defaultOptions.placeholder)
			.setMinValues(config.min_values ?? defaultOptions.min_values)
			.setMaxValues(config.max_values ?? defaultOptions.max_values),
}

/**
 * @param {Object} componentConfig
 * @returns {Object}
 */
function buildComponent(componentConfig) {
	const builder = componentBuilders[componentConfig.type]
	if (!builder)
		throw new Error(`Неизвестный тип компонента: ${componentConfig.type}`)

	return builder(componentConfig)
}
