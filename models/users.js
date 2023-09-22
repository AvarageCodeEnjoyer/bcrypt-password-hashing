const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  username: String,
  email: {type: String, unique:true},
  gender: {type: String, enum:['male', 'female']},
  password: String,
  confirmPassword: String,
  country: String,
  phone: String,

})

module.exports = mongoose.model('Student', studentSchema)