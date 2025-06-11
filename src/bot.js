import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
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
client.globalData = new Collection()
client.commandsArray = []

const handlersDirectory = path.join(__dirname, 'handlers')

const handlersFiles = fs
	.readdirSync(handlersDirectory)
	.filter(file => file.endsWith('.js'))

for (const file of handlersFiles) {
	const handlerFilePath = path.join(handlersDirectory, file)
	const { default: handler } = await import(`file://${handlerFilePath}`)
	handler(client, __dirname)
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

const setUpBot = async () => {
	await client.eventsHandler()
	await client.commandsHandler()
	await client.componentsHandler()
	await client.globalDataHandler()
	// await client.languagesHandler()

	await client.login(process.env.DISCORD_TOKEN)

	await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
		body: client.commandsArray,
	})
}

setUpBot()
