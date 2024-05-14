import express from 'express';
import {signUser} from '../controllers/UserController.js'

const router = express.Router();

router.get('/' , (req, res) => {
    res.render("index")
})

router.post('/signup', signUser);
export default router;
