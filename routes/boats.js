var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var config = require("../config/");
var db = mongojs(config.database);
var Boat = require("../models/boat")


//get boat list
router.get("/list", ensureAuthenticated,(req, res, next) => {
    
    db.boats.find( (err, data) => {
        if (err)
            res.send(err);
        else {
            res.render("boats",{boats:data,title:"Boats List"})
        }
    })
});

router.get("/addBoat",ensureAuthenticated,(req, res, next)=>{
    res.render("addBoat",{title:"Add Boat"})
})

//get single boat 
router.get("/detail/:id",ensureAuthenticated,(req,res,next)=>{
    db.boats.findOne({_id:mongojs.ObjectId(req.params.id)},
function(err,data){
    if (err){
        res.send(err);
    }
    res.json(data)
});
});

router.post('/create',ensureAuthenticated,(req,res)=>{
    var boat = req.body
    var name = boat.BoatName
    var lengthInFeet = boat.BoatLengthInFeet
    var boatYear = boat.BoatYear
    var boatCapacityInPeople = boat.BoatCapacityInPeople
    var boatPictureUrl = boat.BoatPictureUrl

    // validation
    req.checkBody('BoatName',"Boat Name is required").notEmpty()
    req.checkBody('BoatLengthInFeet',"lengthInFeet must be a number").isDecimal()
    req.checkBody('BoatYear',"boatYear must be an Interger").isInt()
    req.checkBody('BoatCapacityInPeople',"boatCapacityInPeople must be an Interger").isInt()
    req.checkBody('BoatPictureUrl',"boatPictureUrl is required").isURL()


    var errors = req.validationErrors()

    if (errors){
        console.log("invalid !")
        res.render("addBoat",{
            errors: errors
        })
    }else {
        var newBoat = new Boat({
            BoatName:name,
            BoatLengthInFeet:lengthInFeet,
            BoatYear:boatYear,
            BoatCapacityInPeople:boatCapacityInPeople,
            BoatPictureUrl: boatPictureUrl
        })
        Boat.createBoat(newBoat,function(err,boat){
            if (err) throw err;
            console.log(boat);
        })

        //req.flash("success-msg","Create Success!")
        res.redirect('/boats/list')
    }
})

//delete boat
router.get("/delete/:id",ensureAuthenticated,(req,res,next)=>{
    db.boats.remove({ _id:mongojs.ObjectId(req.params.id)},function(err,data){
        if (err){
            res.send(err)
        }
        res.redirect("/boats/list")
    
    })
})

router.get("/update/:id",ensureAuthenticated,(req,res,next)=>{
    db.boats.findOne({_id:mongojs.ObjectId(req.params.id)},
    function(err,data){
        if (err){
            res.send(err);
        }
        res.render("updateBoat",{_id:data._id, BoatName:data.BoatName,BoatLengthInFeet:data.BoatLengthInFeet,
        BoatYear:data.BoatYear,BoatCapacityInPeople:data.BoatCapacityInPeople,BoatPictureUrl:data.BoatPictureUrl})
    });
})

//update boat
router.post("/update/:id",ensureAuthenticated,(req,res,next)=>{



        // validation
        req.checkBody('BoatName',"Boat Name is required").notEmpty()
        req.checkBody('BoatLengthInFeet',"lengthInFeet must be a number").isDecimal()
        req.checkBody('BoatYear',"boatYear must be an Interger").isInt()
        req.checkBody('BoatCapacityInPeople',"boatCapacityInPeople must be an Interger").isInt()
        req.checkBody('BoatPictureUrl',"boatPictureUrl is required").isURL()
    
    
        var errors = req.validationErrors()
    
        if (errors){
            console.log("invalid !")
            res.render("updateBoat",{_id:req.params.id, BoatName:req.body.BoatName,BoatLengthInFeet:req.body.BoatLengthInFeet,
                BoatYear:req.body.BoatYear,BoatCapacityInPeople:req.body.BoatCapacityInPeople,BoatPictureUrl:req.body.BoatPictureUrl,errors:errors})
        }else{

            var boat = req.body
            var changedBoat = {}
            if (boat.BoatName){
                changedBoat.BoatName = boat.BoatName
            }
            if (boat.BoatLengthInFeet){
                changedBoat.BoatLengthInFeet = boat.BoatLengthInFeet
            }
            if (boat.BoatYear){
                changedBoat.BoatYear = boat.BoatYear
            }
            if (boat.BoatCapacityInPeople){
                changedBoat.BoatCapacityInPeople = boat.BoatCapacityInPeople
            }
            if (boat.BoatPictureUrl){
                changedBoat.BoatPictureUrl = boat.BoatPictureUrl
            }
            if (Object.keys(changedBoat).length == 0 ){
                res.status(400)
                res.json(
                    {"error":"Bad data"}
                )
            }else{
                db.boats.update({
                    _id:mongojs.ObjectId(req.params.id)},
                    changedBoat,{},function(err,data){
                        if (err){
                            res.send(err)
                        }
                        res.redirect("/boats/list")
                   
                })
            }
        }

})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/');
    }
}

module.exports = router;
