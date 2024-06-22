const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const database = require('./config/database');
require('./config/passport');

const adminRoutes = require('./routes/adminRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));


app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hii Dada, your server is running' });
});

app.post('/checkAuth', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ status: true, role: req.user.role });
        } else {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, error: 'Invalid or expired token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


app.use('/Admin', adminRoutes);
app.use('/Mentor', mentorRoutes);
app.use('/Student', studentRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
