import mongoose from "mongoose";

const connectMongoDB = async () => {
    console.log("to MongoDB.");
    let password="ydEjlYTJtUXPiGuS"
    let user_name="sahal"
    const MONGODB_URI=`mongodb+srv://${user_name}:${password}@cluster0.fbngfbs.mongodb.net/?retryWrites=true&w=majority`
     mongoose.connect(MONGODB_URI,{dbName:"ASP"});
   var db= mongoose.connection
   db.on('error',console.error.bind(console,"DB connection error"))
   db.once('open',function(){
    console.log("successfully connected to db")
   })

};

export default connectMongoDB;