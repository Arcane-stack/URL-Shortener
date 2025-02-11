const express = require("express");
const {generateNewShortURL,handleGetAnalytics} = require("../controllers/url");
const router = express.Router();

router.get("/analytics/:shortId",handleGetAnalytics);
router.post("/",generateNewShortURL);

module.exports = router;