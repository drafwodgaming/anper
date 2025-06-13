export const buildImageUrl = (isShiki, anime) => {
	if (!anime) return null
	if (isShiki) {
		const path = anime.image?.original || anime.image?.preview
		return path
			? path.startsWith('http')
				? path
				: `https://shikimori.one${path}`
			: null
	}
	return anime.images?.jpg?.large_image_url || null
}
