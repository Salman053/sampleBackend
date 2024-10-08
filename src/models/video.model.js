import  { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"

const videoSchema = new Schema({
    videoFile:{
        type: String, // cloudinary url
        required: true
    },
    thumbnail:{
        type: String, // cloudinary url
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes:{
        type: Number,
        default: 0
    }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);


export const Video = model("Video", videoSchema);
