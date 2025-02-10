const express =  require("express");
const router = express.Router({mergeParams:true});  // mergeParams ko hum isliye use krte hai take req ki id ko access kr ske
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

// Review
// Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
    
    //Delete Review Route
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

    module.exports = router;