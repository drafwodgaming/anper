import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fg from 'fast-glob'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages,
	],
})

client.commands = new Collection()
client.modals = new Collection()
client.buttons = new Collection()
client.selectMenus = new Collection()
client.commandsArray = []

const files = await fg('handlers/**/*.js', {
	cwd: __dirname,
	absolute: true,
})

for (const file of files) {
	const { default: handler } = await import(`file://${file}`)
	await handler(client, __dirname)
}

const rest = new REST({ version: process.env.REST_VERSION }).setToken(
	process.env.DISCORD_TOKEN
)

await client.eventsHandler()
await client.commandsHandler()
await client.componentsHandler()
await client.globalDataHandler()

await client.login(process.env.DISCORD_TOKEN)

await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
	body: client.commandsArray,
})
