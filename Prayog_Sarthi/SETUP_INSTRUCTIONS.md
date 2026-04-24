# Prayog Sarthi - NGO Registration Form

## Overview
This is a fully functional NGO Registration form for the Prayog Sarthi project with:
- ✅ Professional HTML/CSS styling matching project theme
- ✅ Client-side form validation
- ✅ Backend API integration
- ✅ Data persistence (JSON & CSV)
- ✅ Responsive design
- ✅ Error handling

## Files Included

### Frontend
- **NGORegistrationForm.html** - Main registration form UI with styling and validation
- **LandingPage.html** - Landing page with navigation

### Backend
- **server.js** - Express.js backend server
- **package.json** - Node.js dependencies

## Setup Instructions

### 1. Install Backend Dependencies

```bash
# Navigate to project directory
cd "c:\Users\ASUS\OneDrive\Desktop\Hackathon Project File 2"

# Install dependencies
npm install
```

This will install:
- Express.js (web server)
- CORS (cross-origin requests)
- Body-parser (request parsing)

### 2. Start the Backend Server

```bash
# Start the server
npm start

# Or use nodemon for development (auto-reload)
npm install --save-dev nodemon
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Open the Form

Option 1: With Live Server
- Right-click on `NGORegistrationForm.html`
- Select "Open with Live Server"
- Navigate to `http://127.0.0.1:5500/NGORegistrationForm.html`

Option 2: Direct file open
- Open `NGORegistrationForm.html` in your browser

## Features

### Form Fields
- **Organization Details**: NGO Name, Email, Phone, Address
- **Contact Information**: Contact Person Name & Email
- **Volunteer Requirements**: 
  - Number of volunteers needed
  - Category of volunteers
  - Age group
  - Experience level
  - Detailed description

### Validation
- ✅ Required field checking
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Minimum character length validation
- ✅ Real-time error feedback

### Backend Endpoints

#### Submit NGO Registration
```
POST /api/register-ngo
Content-Type: application/json

{
  "ngoName": "Example NGO",
  "email": "contact@ngo.com",
  "phone": "+91-9999999999",
  "address": "Address here",
  "contactPersonName": "John Doe",
  "contactPersonEmail": "john@ngo.com",
  "volunteersNeeded": "5",
  "categoryOfVolunteers": "blind",
  "volunteerAgeGroup": "20-25",
  "experienceLevel": "1-3",
  "volunteerDescription": "Description..."
}

Response:
{
  "success": true,
  "message": "Registration submitted successfully",
  "registrationId": "1234567890"
}
```

#### Get All Registrations (Admin)
```
GET /api/registrations

Response:
[
  {
    "id": "1234567890",
    "ngoName": "Example NGO",
    ...
    "registrationDate": "2025-04-05T10:30:00Z",
    "status": "pending"
  }
]
```

#### Get Single Registration
```
GET /api/registrations/:id
```

## Data Storage

Registrations are stored in:
- **JSON Format**: `data/ngo_registrations.json`
- **CSV Format**: `data/ngo_registrations.csv` (for Excel/Sheets)

The `data/` directory is created automatically on first submission.

## Styling Details

### Color Scheme (Matching Project)
- **Primary Gold**: rgb(250, 195, 8)
- **Dark Gray**: #2c3e50, #34495e
- **Light Background**: #f8f9fa, #e8eaed
- **Accent**: rgb(250, 195, 8)

### Fonts
- **Headings**: Chana (custom)
- **Body**: Bellefair (custom)
- **Descriptive**: hotel2 (custom)

## Responsive Breakpoints
- Desktop: Full width layout
- Tablet (≤ 768px): Stack form sections
- Mobile (≤ 480px): Single column, optimized spacing

## Browser Compatibility
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Troubleshooting

### Form not submitting?
1. Ensure backend server is running on port 5000
2. Check browser console for errors (F12)
3. Verify form validation passes

### Backend not starting?
```bash
# Check Node.js is installed
node --version

# Reinstall dependencies
npm install
```

### Port 5000 already in use?
```bash
# Change PORT in server.js or
PORT=3000 npm start
```

## Future Enhancements

- [ ] Email notification to admin
- [ ] Email confirmation to NGO
- [ ] Admin dashboard for viewing registrations
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] File upload support
- [ ] Payment integration

## Support

For issues or questions, contact: dudheby@rknec.edu
