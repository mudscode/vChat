const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, password: {
        type: String,
        required: true
    }, avatar: {
        type: String,
        default: "mudasir.jpg"
    }, bio: {
        type: String
    }, groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        }
    ]
}, {
    timeseries: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;