import mongoose from 'mongoose'
const Schema=mongoose.Schema;

 const resSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    Topic1:{
        type:String,
        required:true
    },
    Topic2:{
        type:String,
        
    },
    Topic3: {
        type: String,
        
    },
    Link1: {
        type: String,
        
    },
    Link2: {
        type: String,
        
    }
 })
export default mongoose.model('Res',resSchema)