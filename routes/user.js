const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{    // help to find user exists or not
    failureRedirect:"/login", //if user user doesn't exist then redirect to login page
    failureFlash:true,
    }),  // if user exist but entered wrong password
    userController.login);
router;

router.get("/logout",userController.logout);

module.exports = router;
