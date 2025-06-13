import fetch from 'node-fetch'

export const fetchAnimeData = async (url, headers = {}) => {
	const res = await fetch(url, { headers })
	if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
	const json = await res.json()
	return json.data || json
}
