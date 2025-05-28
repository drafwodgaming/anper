import mongoose from 'mongoose'

export default async () => {
	if (!process.env.MONGO_URL) {
		return console.warn(
			'MongoDB URL is not provided in the .env file, skipping database connection...'
		)
	}
	await mongoose.connect(process.env.MONGO_URL)
}
