const bcrypt = require('bcrypt');
const crypto = require("crypto");
const User = require("../model/user");
const Token = require("../model/token");
const sendEmail = require("../utils/util");

const saltRounds = 10;

const UserController = {
    checkIsLoggedIn: (req, res, next) => {
        if(req.session.isLoggedIn){
            next()
        }else{
            res.redirect("/login");
        }
    },

    registerUser: async (req, res) => {
        const {username,email,password}=req.body;
        bcrypt.hash(password, saltRounds).then(async function(hash) {
            const usernameExist = await User.findOne({username: username});
            if(usernameExist){
                res.send("username already exists");
                return;
            }
            const emailExist = await User.findOne({email: email});
            if(emailExist){
                res.send("Email already exists");
                return;
            }
            // Store hash in your password DB.
            const newUser=new User({username,email,password:hash});
            //admin :
            newUser.isAdmin = username.toLowerCase() === 'varnika' && email === 'varnika1522.be21@chitkara.edu.in'
            if(newUser.isAdmin){
                newUser.verify = true;
                await newUser.save();
                res.redirect("/login");
                return;
            }
            await newUser.save();
            let token = new Token({
                userId: newUser._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
            await token.save();
            const message = `http://localhost:3000/verify/${newUser.id}/${token.token}`;
            await sendEmail(newUser.email, "Verify Email", message);
            res.send("verify your email by clicking link send to your email");
        });
    },

    verifyUser: async (req, res) => {
        const {id}=req.params;
        let user= await User.findOne({_id:id});
        if(!user) return res.status(400).send("Invalid link");

        let token=await Token.findOne({userId:id,token:req.params.token});
        if(!token) return res.status(400).send("Invalid link");
        // await User.updateOne({_id:user.id,verify:true});
        user.verify=true;
        await user.save();
        await Token.findByIdAndDelete(token._id);
        res.redirect("/");
    },

    loginUser: async (req, res) => {
        const {username,password} =req.body;
        let user=await User.findOne({username:username});
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    req.session.isLoggedIn=true;
                    req.session.user=user
                    res.redirect("/");
                } else {
                    res.send("Invalid password");
                }
            });
        }else{
            res.send("user not found!!!");
        }
    },

    logoutUser: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    },

    renderHome: (req, res) => {
        res.render("home", { user: req.session.user });
    },

    renderLogin : (req, res) => {
        res.render("login");
    },

    renderRegister :(req, res) => {
        res.render("register");
    }

};

module.exports = UserController;
