const mongoose = require("mongoose");

const connectDb = () => { 
    mongoose.connect(process.env.MONGODB_URI).then(
  () => console.log(`Connected to Database ...`),
  (error) => console.log(`Error connecting to Database: ${error}`)
);
}

module.exports = connectDb