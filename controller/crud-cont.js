// const Employee = require("../models/crud-model");
const UserModel = require("../models/auth-model");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/');
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"|| file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG files are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5, // 5MB file size limit
    },
    fileFilter: fileFilter,
});

const addUser = async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        // Validate if the required fields are provided
        if (!name || !email || !age ) {
            return res.status(400).json({ error: 'Name, email, age, and password are required fields' });
        }

        const user = new UserModel({ name, email, age, password, imagePath });
        const userData = await user.save();
        res.status(201).json(userData);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Error adding user" });
    }
};



const readAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error reading users:", error);
        res.status(500).json({ error: "Error reading users" });
    }
};


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, age ,password } = req.body || {}; // Use empty object as fallback
        const updatedData = { name, email, age ,password };

        if (req.file) {
            updatedData.imagePath = req.file.filename;
        }

        const user = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = { addUser, updateUser, upload, deleteUser, readAllUsers };
