import mongoose from 'mongoose' ;

const connectDB = async() =>{
    await mongoose.connect(  
        "mongodb+srv://gulabJaamun:Bhq8zeOk5KDM5zv1@gulabjaamun.id9ulo7.mongodb.net/devTinder"
    )
}


module.exports = connectDB ;