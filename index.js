if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore=require('connect-mongo');
const flash = require('connect-flash');
const passport=require('passport');
const Localstrategy=require('passport-local');
const app = express();

const listingRoute=require('./Routes/listing.js');
const reviewsRoute=require('./Routes/review.js');
const userRoute=require('./Routes/user.js')

const User=require('./models/userSchema.js');

const { Cookie } = require('@mui/icons-material');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const dbUrl=process.env.MONGO_URL
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(dbUrl);
// }

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRECT,
  },
  touchAfter:24*3600,
})
store
const sessionOption = {
  store,
  secret:process.env.SECRECT,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60*1000,
    httpOnly:true,
  },
 }

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingRoute);

app.use("/listings/:id/reviews",reviewsRoute);

app.use("/",userRoute);



// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page not Found!"))
// })

app.use((err,req,res,next)=>{
  let{status=500,message="Something went wrong!"}=err;
  res.render("error.ejs",{message})
})
app.listen(3000,()=>{
    console.log("Sever is running on 3000");
    mongoose.connect(dbUrl);
    console.log("DB is connected");
})