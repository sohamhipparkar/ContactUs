const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/contactUs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        message,
    });

    try {
        await newContact.save();
        res.status(201).send('Contact message saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving contact message.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});