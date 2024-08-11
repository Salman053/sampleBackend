import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        // required: true,
        min: 0,
        default: 0
    },
    stock: {
        type: Number,
        // required: true,
        min: 0,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });


export const Product = mongoose.model('Product', productSchema)