import mongoose from 'mongoose';

const DB_URL = process.env.MONGO_ATLAS_URL || 'mongodb://localhost:27017/social-drive';

mongoose.connection.once('open', () => console.log('MongoDB connection open...'));

mongoose.connection.on('error', (err) => console.log(err));

mongoose.set('strictQuery', false);

export async function connectToDB() {
	try {
		await mongoose.connect(DB_URL);
	} catch (err) {
		console.log(err);
	}
}
