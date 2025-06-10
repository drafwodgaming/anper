const getLanguageFlag = languageCode => {
	const languageFlags = {
		en: global.emojis.englishFlag,
		ru: global.emojis.russianFlag,
		uk: global.emojis.ukraineFlag,
	}

	return languageFlags[languageCode] || languageCode
}

export { getLanguageFlag }
