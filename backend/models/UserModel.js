const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        
    },
    isAdmin:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
});


//Hash user password before saving to database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password,10);
})

//Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User",userSchema);
module.exports = User;