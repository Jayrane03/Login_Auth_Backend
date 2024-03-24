const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    imagePath: {
        type: String,
        required: false
    }
    
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
