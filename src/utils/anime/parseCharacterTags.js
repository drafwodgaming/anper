export const parseCharacterTags = text =>
	text.replace(
		/\[character=(\d+)\](.+?)\[\/character\]/g,
		(m, id, name) => `[${name}](https://shikimori.one/characters/${id})`
	)
