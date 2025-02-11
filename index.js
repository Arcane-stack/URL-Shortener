const express = require("express");
const urlRoute = require("./routes/url");
const path = require("path");
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const {checkForAuthentication,restrictTo} = require("./middleware/auth")
const staticrouter = require("./routes/staticrouter");
const userRoute = require("./routes/user");
const app = express();
const PORT = "8001";

connectToMongoDb("mongodb://localhost:27017/short-url").then(() => {
  console.log("Connected to MongoDB successfully!");
});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(checkForAuthentication);

app.use("/",staticrouter);
app.use("/url",restrictTo(["NORMAL",'ADMIN']), urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
