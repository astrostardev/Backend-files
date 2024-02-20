const mongoose = require('mongoose')

const bonusSchema = new mongoose.Schema({
    welcomeBonus:{type:String},
    refBonus:{type:String},
    referralAmount:{type:String}
})
let Bonus = mongoose.model("Bonus", bonusSchema)
module.exports = Bonus 