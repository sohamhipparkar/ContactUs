const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contact-form')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Define schema and model for contact form data
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// Route for handling form submissions
app.post('/submit', async (req, res) => {
    console.log(res); // Log the incoming request body
    
    try {
        const { name, email, message } = req.body;

        // Validate input fields
        if (!name || !email || !message) {
            return res.status(400).send('<script>alert("All fields are required!"); window.location.href = "/";</script>');
        }

        // Check if the email ends with @gmail.com
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).send('<script>alert("Email must end with @gmail.com"); window.location.href = "/";</script>');
        }

        // Create a new contact document
        const newContact = new Contact({ name, email, message });

        // Save to MongoDB
        await newContact.save();
        res.status(201).send('<script>alert("Your message has been sent successfully. We will get back to you shortly."); window.location.href = "/";</script>');
    } catch (error) {
        console.error(error);
        res.status(500).send('<script>alert("Error connecting with us. Please try again later!"); window.location.href = "/";</script>');
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000' )});
