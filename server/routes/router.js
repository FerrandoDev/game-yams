import express from 'express';
import {signUser , loginUser} from '../controllers/UserController.js'

const router = express.Router();

router.get('/' , (req, res) => {
    res.render("index")
})

router.post('/signup', signUser);
router.post('/login', loginUser);
export default router;
