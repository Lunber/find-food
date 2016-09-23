/**
 * Created by lwb on 2016/9/23.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema

var recordSchema = new Schema({
    date:Date,
    place:String,
    id:Number,
    weight:Number
})

module.exports = mongoose.model('Record' , recordSchema)
