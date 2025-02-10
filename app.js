
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); // use to store session on mongoatlas
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(res=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);

};

const store = MongoStore.create({
    mongoUrl: dbUrl,             // hamara data kaha store hoga
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, // 1 day
});

store.on("error",()=>{
    console.log("Error in mongo session store");
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24 * 60 *60 * 1000,
        maxAge: 7*24 *60 * 60 * 1000,
        httpOnly: true, 
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//middleware that initialize passport
app.use(passport.session()); // check user is same or not
passport.use(new LocalStrategy(User.authenticate())); // it check user authentication

passport.serializeUser(User.serializeUser());// help to store user related information 
passport.deserializeUser(User.deserializeUser());// if user end the session then we need to deserialize thr user

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

    // app.get("/demouser",async(req,res)=>{
    //     let fakeUser = new User({
    //         email: "student@gmail.com",
    //         username:"delta-student",

    //     });
    //     let registeredUser = await User.register(fakeUser,"helloworld");//it help to register new user
    //     res.send(registeredUser);
    // });



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("server is listening to port 8080");
});