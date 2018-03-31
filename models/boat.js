var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); 

var BoatSchema = mongoose.Schema({
    BoatName:{
        type: String,
        index:true
    },
    BoatLengthInFeet:{
        type: Number
    },
    BoatYear:{
        type: Number
    },
    BoatCapacityInPeople:{
        type: Number
    },
    BoatPictureUrl:{
        type:String
    }
})

var Boat = module.exports = mongoose.model('Boat',BoatSchema)

 module.exports.createBoat = function(newBoat,callback){
     newBoat.save(callback)
 }