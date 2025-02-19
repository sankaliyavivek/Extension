const mongooes = require('mongoose');


const ExtensionUser = mongooes.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    }

})

module.exports = mongooes.model('ExtensionUser', ExtensionUser);