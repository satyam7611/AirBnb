require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.models.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
}

// initialising the data into the data base loading the data from the data.js or we can load from the api

const initDB=async()=>{
    //deleting the all data before inserting the data to DB;
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'697df50661d17cf9c677d9a0'}))
    await Listing.insertMany(initData.data)
    console.log("Data was initialised")
}

initDB();