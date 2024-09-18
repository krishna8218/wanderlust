const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://localhost:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
//to connectt with database
async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  //clean databse first
  await Listing.deleteMany({});
  //add the sample data we have
   initData.data=initData.data.map((obj)=>({...obj, owner:"66e586c7e6f13f75d9aff16e"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();