const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const HotdogSchema = new Schema({
    type:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String
    },
    ingredients: {
        type: [String]
    }
})

mongoose.model('hotdogs', HotdogSchema);