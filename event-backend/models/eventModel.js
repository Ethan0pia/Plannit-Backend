var mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = new Schema({
  name:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  blurb:{
    type: String
  },
  location:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  organizer_id:{
    type: String
  },
  organizer_username:{
    type: String,
  },
  items:[{
    list_name : String,
    items : [String]
  }],
  food:{
    type:Boolean
  },
  private:{
    type:Boolean
  }
}, { strict: false });