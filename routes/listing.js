const express =  require("express");

const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer'); // multer is used to parse multi data formate type i.e parse files
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}) ; // folder used to store files which is parse by multer


// index route
// create route

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create)
);



//new route 

router.get("/new",isLoggedIn,listingController.new);

// show route
//Update route
//delete route

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

module.exports = router;