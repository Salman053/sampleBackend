import mongoose from "mongoose";

const sub_todoSchoma = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    


}, { timestamps: true });


export const SubTodo = mongoose.model("SubTodo", sub_todoSchoma);