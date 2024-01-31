import express from "express"
const router = express.Router()

import UserRoutes from './User.js'

router.use('/user',UserRoutes)

export default router