const mongoose=require('mongoose')


const cardSchema = new mongoose.Schema({
    number:{
        type:Number,
        unique:true,
        required:true,
        trim:true,
    },
    //Expiary Date 
    date:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Customer'
    }
})

const Cards=mongoose.model('Cards',cardSchema)

module.exports=Cards