import mongoose from 'mongoose'

export default async () => {
	const uri = process.env.MONGO_URL
	if (!uri) return console.warn('MongoDB URL is not provided in the .env file')

	await mongoose.connect(uri)
}
