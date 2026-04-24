const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
    // Try to connect to standard MongoDB using .env URI first
    if (process.env.MONGO_URI) {
        try {
            console.log(`⏳ Attempting to connect to MongoDB at: ${process.env.MONGO_URI}`);
            await mongoose.connect(process.env.MONGO_URI);
            console.log(`\n✅ MongoDB Connected Successfully to standard local database!`);
            return; // Exit function if successful
        } catch (err) {
            console.log(`\n⚠️ Could not connect to standard MongoDB: ${err.message}`);
            console.log(`Falling back to auto-provisioned local server...`);
        }
    }

    try {
        console.log('⏳ Starting local MongoDB server automatically (this may take a few seconds on first run)...');
        
        // Ensure data directory exists for persistence (optional, but good practice)
        const dbPath = path.join(__dirname, '..', 'data', 'mongodb');
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }

        // Start an auto-provisioned MongoDB server
        const mongoServer = await MongoMemoryServer.create({
            instance: {
                dbPath: dbPath,
                storageEngine: 'wiredTiger' // allows data persistence
            }
        });
        
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log(`\n✅ Auto-provisioned MongoDB Connected Successfully: ${mongoUri}`);
        console.log(`✅ Data is being saved in the 'data/mongodb' folder.\n`);
    } catch (error) {
        console.error(`\n❌ Error starting auto-provisioned MongoDB: ${error.message}`);
        console.log('Falling back to basic in-memory server without persistence...');
        
        try {
            const fallbackServer = await MongoMemoryServer.create();
            const uri = fallbackServer.getUri();
            await mongoose.connect(uri);
            console.log(`\n✅ MongoDB Connected (Volatile Mode): ${uri}`);
        } catch (fallbackError) {
            console.error('Fatal error starting MongoDB:', fallbackError);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
