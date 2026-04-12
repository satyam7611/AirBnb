if(process.env.NODE_DEV!="production"){
  require("dotenv").config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); // ejs setup
const cors = require("cors");



const dbUrl=process.env.ATLASDB_URL;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require('./utils/ExpressError.js');

const session = require("express-session");

const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user.models.js')
const listingsRouter=require('./routes/listing.js')
const reviewsRouter=require('./routes/reviews.js')
const userRouter=require('./routes/user.js')

main()
  .then(() => {
    console.log("connected to DB 😎😎");
  })
  .catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(dbUrl);
  } catch (err) {
    console.log("-----------------------------------------");
    console.log("CRITICAL: MONGODB ATLAS DNS BLOCKED");
    console.log("Your current internet connection (ISP/Wi-Fi) is blocking MongoDB SRV requests.");
    console.log("To fix this, connect to a Mobile Hotspot instead of your current Wi-Fi!");
    console.log("-----------------------------------------");
    throw err;
  }
}
//session store info
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // ✅ correct place
});

store.on("error", function (err) {
  console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const PORT = 8081;
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beech",
//     price: 1200,
//     location: "Calangite, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was added");
//   res.send("successfull 😎");
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // it will parse all the data that comes in the request
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // use to access the static files and folder like the public folder files and folder

// INDEX ROUTE

// app.get("/", (req, res) => {
//   res.send("I am server");
// });

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));


app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next()
})

//pbkdf hashing algorithm uses here in passport

// app.get('/registerUser',async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   })
//  let registeredUser=await User.register(fakeUser,'password')
//  console.log(registeredUser)
//  res.send(registeredUser)
// })

app.use('/listings',listingsRouter)
app.use('/listings/:id/reviews',reviewsRouter)
app.use('/',userRouter)
//post routed for comment

// if all routes above check then come to this one 


//middleware to handle error of post request 
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 🔥 prevents double response
  }

  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ success: false, error: message, details: err.message });
});




app.listen(PORT,"0.0.0.0", () => {
  console.log(`server listening on port:${PORT} `);
});
