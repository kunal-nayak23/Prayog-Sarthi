require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const connectDB = require('./config/db');
const NGO = require('./models/NGO');
const Volunteer = require('./models/Volunteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB().catch(err => {
    console.error('Database connection failed:', err);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname)));

// Root route (optional)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// ---------------- NGO ----------------
app.post('/api/register-ngo', async (req, res) => {
    try {
        const ngo = await NGO.create(req.body);

        res.status(201).json({
            success: true,
            message: 'NGO Registered',
            id: ngo._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

app.get('/api/registrations', async (req, res) => {
    const data = await NGO.find().sort({ createdAt: -1 });
    res.json(data);
});

// ---------------- Volunteer ----------------
app.post('/api/register-volunteer', async (req, res) => {
    try {
        const volunteer = await Volunteer.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Volunteer Registered',
            id: volunteer._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

app.get('/api/volunteers', async (req, res) => {
    const data = await Volunteer.find().sort({ createdAt: -1 });
    res.json(data);
});

// ---------------- START ----------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});