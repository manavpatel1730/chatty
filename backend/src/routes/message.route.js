import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js"
// import { get } from "mongoose"

const router = express.Router()

router.get("/users",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessages)

export default router