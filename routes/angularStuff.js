var express = require("express")
var router = express.Router()
var mongojs = require("mongojs")
var config = require("../config/")
var db = mongojs(config.database)
var User = require("../models/user")
var Boat = require('../models/boat')
var passport = require('passport')
var jwt = require('jsonwebtoken')

//get all boats 
router.get('/boats',passport.authenticate('jwt',{session:false}),function(req,res){
    Boat.find(function(err,boats){
        if (err){
            res.send(err)
        }
        res.json(boats)
    })
})


router.post('/login',(req,res)=>{
    User.findOne({
        Email:req.body.email
    },function(err,user){
        if (err) throw err
        if (!user){
            res.status(500)
            res.send({err:"empty account!"})    
            return 
        }else {
            User.comparePassword(req.body.pwd,user.Password,function(err,isMatch){
                if (err) throw err
                if (isMatch){
                    if (user.Role == "member"){

                        console.log("login success")
                        // create token
                        var token = jwt.sign(user.toJSON(), config.secret, {
                            expiresIn: 10080 // week in seconds
                            
                        });      
                        res.status(200)
                        //res.send({success:"you success"})
                        res.json({ success: true, token: 'JWT ' + token });
                        return     
                    }else{
                        res.status(500)
                        res.send({err:"you are not member!"})                
                    }
                }else{
                    res.status(500)
                    res.send({err:"wrong password"})
                    return    
                }
            })
        }
    })
})


router.post("/Register",function(req, res, next){
    var user = req.body
    //if (!user.)

    if (!user.Email || !user.Password || !user.FirstName || !user.LastName || !user.Address.street || !user.Address.city || !user.Address.province || !user.Address.postalCode || !user.Address.country){
        console.log("info not completed")
       // res.status(500).send("info incompleted")
       res.status(500)
       res.send({err:"insufficient info"})
       return 

    }else {

        User.getUserByEmail(req.body.Email,function(err, found){
            if (err){
                res.status(500)
                res.send({err:"err occur"})
                return 
            }
            if (!found){
                console.log("I didn't find this account")    
                    var newUser = new User({
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Address: {
                       Street: user.Address.street,
                       City: user.Address.city,
                       Province: user.Address.province,
                       PostalCode: user.Address.postalCode,
                       Country: user.Address.country
                    },
                    Email: user.Email,
                    Password: user.Password,
                    Role: "member"           
                    })
           
                   User.createUser(newUser,function(err,user){
                       if (err){
                           res.status(500)
                           res.send({err:"err occur"})
                           return 
                       }
                       else {
                           console.log("successfully craeted user")
                           res.status(200)
                           res.json({ success: true});
                           return      
                       }
                   })
            }else{
                console.log("I find this account in database.")
                res.status(500)
                res.send({err:"Email existed"})
                return 
            }        
        })
    }    
})
module.exports = router;