import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true,

    },
    complete: {
        type: Boolean,
        default: false,
        // required: true,

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo"
        }
    ]

}, { timestamps: true });


// Export the model

export const Todo = mongoose.model("Todo", todoSchema);