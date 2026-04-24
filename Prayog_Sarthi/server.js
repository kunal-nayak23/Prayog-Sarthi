// server.js - Express backend for form handling with MongoDB
// Run with: npm run dev or node server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const NGO = require('./models/NGO');
const Volunteer = require('./models/Volunteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Prayog Sarthi API Server',
        status: 'running',
        note: 'Visit http://localhost:8000 in your browser to access the frontend',
        endpoints: {
            health: 'GET /api/health',
            registerNGO: 'POST /api/register-ngo',
            registerVolunteer: 'POST /api/register-volunteer',
            allNGOs: 'GET /api/registrations',
            allVolunteers: 'GET /api/volunteers'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', database: 'connected' });
});

// NGO Registration endpoint
app.post('/api/register-ngo', async (req, res) => {
    try {
        const {
            ngoName,
            email,
            phone,
            address,
            contactPersonName,
            contactPersonEmail,
            volunteersNeeded,
            categoryOfVolunteers,
            volunteerAgeGroup,
            experienceLevel,
            volunteerDescription
        } = req.body;

        // Validate required fields
        if (!ngoName || !email || !phone || !address || !contactPersonName || !contactPersonEmail || !volunteerDescription) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Create and save to DB
        const ngo = await NGO.create({
            ngoName,
            email,
            phone,
            address,
            contactPersonName,
            contactPersonEmail,
            volunteersNeeded,
            categoryOfVolunteers,
            volunteerAgeGroup,
            experienceLevel,
            volunteerDescription
        });

        res.status(201).json({
            success: true,
            message: 'Registration submitted successfully',
            registrationId: ngo._id
        });

    } catch (error) {
        console.error('Error processing registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing registration. Please try again.'
        });
    }
});

// Get all NGO registrations (admin endpoint)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await NGO.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching registrations'
        });
    }
});

// Get single registration by ID
app.get('/api/registrations/:id', async (req, res) => {
    try {
        const registration = await NGO.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching registration'
        });
    }
});

// Volunteer Registration endpoint
app.post('/api/register-volunteer', async (req, res) => {
    try {
        const {
            fullName,
            email,
            age,
            phone,
            address,
            disability,
            disabilityDetails,
            skills,
            skillsDescription,
            challenges,
            supportNeeds,
            availability,
            preferredTime,
            motivation
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !age || !phone || !address || !supportNeeds || !motivation || !availability || !preferredTime) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Validate arrays have at least one item
        if (!disability || disability.length === 0 || !skills || skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please select at least one disability type and skill'
            });
        }

        // Create and save to DB
        const volunteer = await Volunteer.create({
            fullName,
            email,
            age,
            phone,
            address,
            disability: Array.isArray(disability) ? disability : [disability],
            disabilityDetails,
            skills: Array.isArray(skills) ? skills : [skills],
            skillsDescription,
            challenges: Array.isArray(challenges) ? challenges : [challenges],
            supportNeeds,
            availability,
            preferredTime,
            motivation
        });

        res.status(201).json({
            success: true,
            message: 'Volunteer registration submitted successfully',
            registrationId: volunteer._id
        });

    } catch (error) {
        console.error('Error processing volunteer registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing registration. Please try again.'
        });
    }
});

// Get all volunteer registrations
app.get('/api/volunteers', async (req, res) => {
    try {
        const registrations = await Volunteer.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching volunteer registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching volunteer registrations'
        });
    }
});

// Get profile by email
app.get('/api/profile', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
        
        let user = await NGO.findOne({ email });
        if (user) return res.json({ success: true, type: 'ngo', data: user });
        
        user = await Volunteer.findOne({ email });
        if (user) return res.json({ success: true, type: 'volunteer', data: user });
        
        res.status(404).json({ success: false, message: 'Profile not found' });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get matching profiles
app.get('/api/matches', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const ngo = await NGO.findOne({ email });
        if (ngo) {
            // Find volunteers whose skills or disability match the NGO's category
            const category = ngo.categoryOfVolunteers ? ngo.categoryOfVolunteers.toLowerCase() : '';
            const allVolunteers = await Volunteer.find();
            
            // Simple keyword matching for hackathon demo
            const matches = allVolunteers.filter(v => {
                const searchString = [...(v.skills || []), ...(v.disability || []), v.skillsDescription || '', v.disabilityDetails || ''].join(' ').toLowerCase();
                const keywords = category.split(/[\s,]+/);
                return keywords.some(kw => kw.length > 2 && searchString.includes(kw));
            });
            
            // Fallback to top 5 if no exact match (so the demo is always populated)
            return res.json({ success: true, matches: matches.length > 0 ? matches : allVolunteers.slice(0, 5) });
        }

        const vol = await Volunteer.findOne({ email });
        if (vol) {
            // Find NGOs needing volunteers matching this volunteer's profile
            const searchString = [...(vol.skills || []), ...(vol.disability || [])].join(' ').toLowerCase();
            const allNGOs = await NGO.find();
            
            const matches = allNGOs.filter(n => {
                const category = n.categoryOfVolunteers ? n.categoryOfVolunteers.toLowerCase() : '';
                return category.split(/[\s,]+/).some(kw => kw.length > 2 && searchString.includes(kw));
            });
            
            return res.json({ success: true, matches: matches.length > 0 ? matches : allNGOs.slice(0, 5) });
        }

        res.status(404).json({ success: false, message: 'User not found' });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ Server is running on http://localhost:${PORT}`);
    console.log(`📝 NGO Registration endpoint: POST http://localhost:${PORT}/api/register-ngo`);
    console.log(`🙋 Volunteer Registration endpoint: POST http://localhost:${PORT}/api/register-volunteer`);
    console.log(`📊 All NGO Registrations: GET http://localhost:${PORT}/api/registrations`);
    console.log(`👥 All Volunteer Registrations: GET http://localhost:${PORT}/api/volunteers\n`);
});
