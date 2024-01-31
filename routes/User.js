import express from "express"
import UserController from "../controller/User.js"
const router = express.Router()


router.post('/',UserController.create)
router.post('/forgotPassword',UserController.forgotPassword)
router.get('/getUsers',UserController.getUsers)
router.put('/resetPassword',UserController.resetPassword)
router.get('/listAllUsers',UserController.ListAllUsers)
router.post('/login',UserController.login)

export default router