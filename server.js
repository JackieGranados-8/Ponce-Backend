//This files purpose is to start server, will tell express where review routes live, will overall connect evrything


console.log("🔥 SERVER FILE LOADED 🔥");

const express = require("express");//bring an express to create api
//const cors = require("cors");
const allowedOrigins = [
  "https://poncecountertopsinc.com",
  "https://www.poncecountertopsinc.com",
  "http://localhost:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow tools like Postman or server-to-server calls
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));
//enables cross origin requests
const rateLimit =require("express-rate-limit");
require('dotenv').config()//allows us to safely store credentials
const mongoose = require("mongoose");


const app = express(); 
app.use(cors());//enables cors so backend can communicate w frontend

app.use(express.json());


const reviewsRoute = require("./routes/reviews");
const contactRoutes = require ('./routes/contact');


const PORT = process.env.PORT || 5000;//backend and front end can't use the same port

//middleware
app.use(express.urlencoded({ extended: true }));//*

//rate limiting for protection, 2 submissions every 15 min per IP

const reviewLimiter= rateLimit({
  windowMs: 15 * 60 * 1000,
  max:100
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});


app.use("/api/reviews",reviewLimiter, reviewsRoute);
//app.use("/api/reviews",reviewsRoute);

app.use("/api/contact", contactLimiter, contactRoutes);
//app.use('/api/contact', contactRoutes);


// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

//temp
//console.log("RAW MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log (" MongoDB connected"))
.catch(err => {
  console.error ("MongoDB connection error:", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


//**** */






// CONTACT ROUTE





