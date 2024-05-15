import express from 'express';
import AuthJTW from "../middleware/auth.js";
import { signUser, loginUser } from '../controllers/UserController.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index")
});

router.post('/signup', signUser);
router.post('/login', loginUser);
router.get('/game', AuthJTW, (req, res) => {
  console.log(req.session.user)
    if (!req.session.user) {
        return res.status(401).send("Vous devez être connecté pour accéder à cette page.");
    }
    res.render('pages/game', {
        chanceCount: req.session.user.chanceCount,
        username: req.session.user.username
    });
});

export default router;
