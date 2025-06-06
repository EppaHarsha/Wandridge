const mongoose = require("mongoose");

const Listing = require("../models/listingSchema.js");
const insertData= require("../init/data");
const MONGO_URL = "mongodb://127.0.0.1:27017/wandridge";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
  const initData = async()=>{
    Listing.deleteMany({});
    insertData.data = insertData.data.map((obj)=>({
      ...obj,owner:"683ef15eb12396c74f87803a",
    }));
    await Listing.insertMany(insertData.data);
    console.log("Data was initialised");
  }
  initData();

// Listing.deleteMany({})
// .then((res)=>{
//     console.log("Successfully deleted");
// })
// Listing.insertMany(insertData.data)
// .then((res)=>{
//     console.log("Succesfully Inserted");
// })