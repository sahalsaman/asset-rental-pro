import mongoose from "mongoose";
import { env } from "../environment";

const connectMongoDB = async () => {
    console.log("to MongoDB.");
    const MONGODB_URI=`mongodb+srv://${env.DB_USER_NAME}:${env.DB_PASSWORD}@cluster0.fbngfbs.mongodb.net/?retryWrites=true&w=majority`
     mongoose.connect(MONGODB_URI,{dbName:env.DB_NAME});
   var db= mongoose.connection
   db.on('error',console.error.bind(console,"DB connection error"))
   db.once('open',function(){
    console.log("successfully connected to db")
   })

};

export default connectMongoDB;