import mongoose from "mongoose";


const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    pincode: {
        type: String,
        required: true,
        unique: true
    },
    sepcializedIn: [
        {
            type: String,
        }
    ],
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    beds: {
        type: Number,
        required: true
    }
    


}, { timestamps: true })

export const Hosptal = mongoose.model('Hospital', hospitalSchema)