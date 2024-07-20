import Contact from '../model/contactusmodel.js';

// Create a new contact
export const createContact = async (req, res) => {
    const { name, email, subject, message, user } = req.body;
    try {
        const newContact = new Contact({ name, email, subject, message, user });
        await newContact.save();
        res.status(201).send({ message: 'Contact form submitted successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to submit contact form.' });
    }
};

// Additional functions for other CRUD operations can be added here as needed
