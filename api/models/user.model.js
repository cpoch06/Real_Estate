import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,   
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/dk5b3f3zg/image/upload/v1633663664/blank-profile-picture-973460_640',
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
