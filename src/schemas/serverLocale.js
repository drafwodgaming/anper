import { Schema, model } from 'mongoose'

export let serverlocaleSchema = new Schema({
	Guild: {
		type: String,
	},
	Language: {
		type: String,
	},
})

export default model('serverlocales', serverlocaleSchema)
