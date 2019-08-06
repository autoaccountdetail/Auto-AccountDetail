const mongoose =require('mongoose');

const User = new mongoose.Schema({
    id: String,
    password: String, //Todo 암호화 과정 필요
    collage: String, // 대학
    section : String,// 단대
    major : String, // 전공
    created_date: {type: Date, default: Date.now},
});

mongoose.model('User', User);
module.exports = mongoose.model('User');