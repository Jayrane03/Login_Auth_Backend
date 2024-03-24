const express = require("express");
const app = express();
const UserModel = require("../models/auth-model");
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../utils/db");
const cors = require("cors");
const PORT = 5001;

// Middleware for parsing request body
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'E:/Backup/Login_Mern/frontend/dist')));


const crudRoute = require("../routes/crud-route"); // Adjust import path for crud-route

app.use("/crud", crudRoute); // Use the /crud prefix for CRUD routes
app.use('/crud/uploads', express.static(path.join(__dirname, 'uploads')));

// User registration endpoint
app.post('/', async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ status: "Error", message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Generate JWT token for the newly registered user
        const token = jwt.sign({
            userId: newUser._id,
            email: newUser.email,
        }, 'secret23', { expiresIn: '2h' }); // Set token expiration to 1 hour

        res.json({ status: "OK", user: newUser, token }); // Include token in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ status: "Error", message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: "Error", message: "Invalid password" });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        }, 'secret23', { expiresIn: '2h' });

        // Return user data along with the token
        res.json({ status: "OK", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});

app.get('/api/home', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
        const decoded = jwt.verify(token, 'secret123');
        const email = decoded.email;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            res.json({ status: 'OK', user: user }); // Sending response with status 'OK' and user data
        } else {
            res.status(404).json({ status: 'Error', message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
});
// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});
