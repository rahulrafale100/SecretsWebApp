require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/SecretDB",{useNewURLParser:true});
const userSchema=new mongoose.Schema({
    username:String,
    password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newUser=new User({
        username:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log("Something wrong");
        }
    });
});
app.post("/login",function(req,res){
    const uname=req.body.username;
    const pswd=req.body.password;
    User.findOne({username:uname},function(err,found){
        if(!err){
            if(found.password===pswd){
                res.render("secrets");
            }
            else{
                console.log("wrong Password");
            }
        }
        else{
            console.log("User not found");
        }
    })
});


app.listen(3000,function(req,res){
    console.log("Started at 3000 port");
})
