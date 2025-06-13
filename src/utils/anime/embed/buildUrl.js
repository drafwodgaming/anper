export const buildUrl = (isShiki, url) =>
	url?.startsWith('http')
		? url
		: isShiki
		? `https://shikimori.one${url || ''}`
		: url
