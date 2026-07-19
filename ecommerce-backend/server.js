const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");


const app = express();


// ================= MIDDLEWARE =================

app.use(cors({
  origin: [
    "https://ecommerce-web-one-mu.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());



// ================= DATABASE =================


const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
.then(()=>{
console.log("MongoDB Connected");
})
.catch(err=>{
console.log("Mongo Error:",err.message);
});




// ================= HEALTH CHECK =================


app.get("/",(req,res)=>{
res.json({
status:"Running",
message:"Fashion Hub Backend"
});
});




// ================= AUTH =================


const authMiddleware=(req,res,next)=>{

const header=req.headers.authorization;


if(!header){
return res.status(401).json({
message:"Login required"
});
}


const token=header.split(" ")[1];


try{

const decoded=jwt.verify(
token,
process.env.JWT_SECRET
);


req.user=decoded;

next();


}catch(err){

return res.status(401).json({
message:"Invalid token"
});

}

};






// ================= SIGNUP =================


app.post("/api/signup",async(req,res)=>{

try{

const {
name,
email,
password
}=req.body;


const exist=
await User.findOne({email});


if(exist)
return res.status(400).json({
message:"User already exists"
});



const hash=
await bcrypt.hash(password,10);



const user=
await User.create({

name,
email,
password:hash

});



res.json({
message:"Signup successful",
user:{
id:user._id,
name:user.name,
email:user.email
}
});


}catch(err){

res.status(500).json({
error:err.message
});

}


});






// ================= LOGIN =================


app.post("/api/login",async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user=
await User.findOne({email});



if(!user)
return res.status(400).json({
message:"User not found"
});



const check=
await bcrypt.compare(
password,
user.password
);



if(!check)
return res.status(400).json({
message:"Wrong password"
});



const token=
jwt.sign(
{
id:user._id
},
process.env.JWT_SECRET,
{
expiresIn:"1d"
}
);



res.json({
token,
user:{
id:user._id,
name:user.name,
email:user.email
}
});



}catch(err){

res.status(500).json({
error:err.message
});

}

});








// ================= PRODUCTS =================


// GET PRODUCTS FAST

app.get("/api/products",async(req,res)=>{

try{


const products=
await Product.find({})
.select(
"title description price image category"
)
.sort({
createdAt:-1
})
.limit(100)
.lean();



res.set(
"Cache-Control",
"public,max-age=300"
);


res.json(products);



}catch(err){

res.status(500).json({
error:err.message
});

}


});






// SINGLE PRODUCT


app.get("/api/products/:id",async(req,res)=>{


try{

const product=
await Product.findById(req.params.id)
.lean();



res.json(product);


}catch(err){

res.status(500).json({
error:err.message
});

}

});







// CREATE PRODUCT

app.post(
"/api/products",
authMiddleware,
async(req,res)=>{


try{


const product=
await Product.create(req.body);


res.json(product);



}catch(err){

res.status(500).json({
error:err.message
});

}

});






// ================= ORDERS =================


app.post(
"/api/orders",
authMiddleware,
async(req,res)=>{


try{


const orders=
req.body.map(item=>({

...item,
userId:req.user.id

}));



const saved=
await Order.insertMany(orders);


res.json(saved);



}catch(err){

res.status(500).json({
error:err.message
});

}


});





app.get(
"/api/orders",
authMiddleware,
async(req,res)=>{


const orders=
await Order.find({
userId:req.user.id
})
.lean();


res.json(orders);


});





app.delete(
"/api/orders/:id",
authMiddleware,
async(req,res)=>{


await Order.findByIdAndDelete(
req.params.id
);


res.json({
message:"Deleted"
});


});







// ================= START =================


const PORT=
process.env.PORT || 5000;



app.listen(PORT,()=>{

console.log(
`Server running ${PORT}`
);

});