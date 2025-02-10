const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try{  // we use try and catch here because no 2 users enter same username 
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{ //req.login automatically login the user who signed up
        if(err)
        {
            return next(err);
        }
        req.flash("success","Welcome to wanderlust!");
        res.redirect("/listings");
    });
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to Wanderlust ! you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    };

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{  // req.logout take callback as a parameter.
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}