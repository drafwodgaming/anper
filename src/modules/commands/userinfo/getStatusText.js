import mustache from 'mustache'

const getStatusText = (status, locale) => {
	const onlineEmoji = global.emojis.online
	const idleEmoji = global.emojis.idle
	const dndEmoji = global.emojis.dnd
	const offlineEmoji = global.emojis.offline
	const unknownEmoji = global.emojis.unknown
	const invisibleEmoji = global.emojis.invisible

	switch (status) {
		case 'online':
			return mustache.render(locale.commands.userInfo.online, {
				onlineEmoji,
			})
		case 'idle':
			return mustache.render(locale.commands.userInfo.idle, {
				idleEmoji,
			})
		case 'dnd':
			return mustache.render(locale.commands.userInfo.dnd, {
				dndEmoji,
			})
		case 'invisible':
			return mustache.render(locale.commands.userInfo.invisible, {
				invisibleEmoji,
			})
		case 'offline':
			return mustache.render(locale.commands.userInfo.offline, {
				offlineEmoji,
			})
		default:
			return mustache.render(locale.commands.userInfo.unknown, {
				unknownEmoji,
			})
	}
}

export { getStatusText }
