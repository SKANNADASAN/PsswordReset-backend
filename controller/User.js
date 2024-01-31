import userModel from "../models/User.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const create = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            await userModel.create(req.body)
            res.status(201).send({
                message: "User created successfully"
            })
        }
        else {
            res.status(400).send({ message: `User with ${req.body.email} already exists` })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (user) {
            let passCompare = req.body.password === user.password
            if (passCompare) {
                let userData = await userModel.findOne({ email: req.body.email },{_id:0,password:0,status:0,createdAt:0,email:0})
                res.status(200).send({
                    message: "Login Successful",
                    userData : userData
                })
            }
            else {
                res.status(400).send({
                    message: "Invalid Password"
                })
            }
        }
        else {
            res.status(400).send({
                message: `Account with ${req.body.email} does not exist`
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


const forgotPassword = async (req, res) => {
    try {
        //Check if user exists in DB
        let userExists = await userModel.findOne({ email: req.body.email })
        if (userExists && req.body.email!=="") {
            const tokenString = generateRandomString(20)
            const mailId = req.body.email
            //Reset Link
            const resetLink = `${process.env.RESET_LINK}?token=${tokenString}&email=${mailId}`;
            
            sendMail(req.body.email, resetLink);

            //update the DB with Random string 
            await userModel.updateOne({ email: req.body.email }, { randomString: tokenString })

            //Status send
            res.status(201).send({
                message: "User is available "
            })
        }
        else {
            res.status(400).send({ message: `User ${req.body.email} does not exists` })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }

    //Functions 
    //Generate Random String
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    //Send mail 
    async function sendMail(mailReceiver, resetLink) {
        try {
            // Create Transporter with email configuration
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Email Content
            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: mailReceiver,
                subject: 'Password Reset',
                text: `This is the password reset link for your account. Please click the below link for resetting your password\n${resetLink}`
            };

            // Send mail
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.log('Error sending email:', error);
        }
    }
}


const getUsers = async (req, res) => {
    try {
        let users = await userModel.find({}, { password: 0, _id: 0 })
        res.status(200).send({
            message: "User Data Fetched Successfully",
            users
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        let user = await userModel.find({ email:req.body.email})
        if(user){
            const pass1 = req.body.pass1
            const pass2 = req.body.pass2
            const equalPassword = pass1 === pass2
            if(equalPassword && pass1!=="" && pass2!==""){
                await userModel.updateOne({email:req.body.email},{password:req.body.pass1})
                await userModel.updateOne({email:req.body.email},{ $unset: { randomString: 1 } })
                res.status(200).send("Updated successfully")
            }
            else{
                res.status(400).send("Password and confirm password doesnt match")
            }
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const ListAllUsers = async (req, res) =>{
    try {
        let allUsers = await userModel.find({}, { _id: 0 })
        res.status(200).send({
            message: "All users Data",
            disclaimer:"Since this is a project, to be tested it shows password, in real time password will be hashed",
            allUsers
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export default {
    create,
    forgotPassword,
    getUsers,
    resetPassword,
    ListAllUsers,
    login
}