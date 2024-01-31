import mongoose from './index.js'

const validateEmail = (e)=>{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(e); 
}

const userSchema =  mongoose.Schema({
    name:{type:String,required:[true,"Name is required"]},
    mobile:{type:Number,required:[true,"Mobile Number is required"]},
    email:{type:String,required:[true,"Email is required"],validate:validateEmail},
    password:{type:String,required:[true,"Password is required"]},
    randomString:{type:String}
},
{
    versionKey:false
})

const userModel = mongoose.model('users', userSchema)
export default  userModel