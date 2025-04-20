// schema: Blueprint what our data should look like
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        unique: true
    },
    isAdmin: {
        type:Boolean,
        default: false,
    },

    profilePic: { type: String, default: null },


},
{ timestamp: true } //give created add and updated at times
);

export default mongoose.model("User", UserSchema)

