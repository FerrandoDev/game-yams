import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import connectDB from './server/config/db.js';
import router from './server/routes/router.js';

const app = express();
const port = process.env.PORT || 5001;

connectDB();
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 3600000
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

app.use('/', router);

app.get('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
