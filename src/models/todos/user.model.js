import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 6,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email is must be unique"],
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    // createdAt:{
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt:{
    //     type: Date,
    //     default: Date.now
    // }
}, { timestamps: true })



export const User = mongoose.model('User', userSchema);