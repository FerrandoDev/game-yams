import express from 'express';
import AuthJTW from "../middleware/auth.js";
import { signUser, loginUser } from '../controllers/UserController.js'
import { PlayGame, winGame , gameInfo } from '../controllers/Game.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index")
});

router.post('/signup', signUser);
router.post('/login', loginUser);
router.get('/game', AuthJTW, gameInfo);

//////// AJAX ////////

router.post('/play-game', PlayGame)
router.post('/game/win/:pastries',winGame)


export default router;
