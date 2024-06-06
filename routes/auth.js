import express from 'express';
import {googleLogin, login,register} from '../controllers/auth.js'
import { userVerification } from '../middleware/auth.js';




const router = express.Router();
 
router.post("/login",login)

router.post("/gooleLogin",userVerification,googleLogin)

export default router;
