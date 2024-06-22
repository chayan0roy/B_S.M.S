const Admin_Schema = require('../models/admin');
const Mentor_Schema = require('../models/mentor');
const Student_Schema = require('../models/student');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN_SECRET_KEY
};

passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const admin = await Admin_Schema.findOne({ _id: jwt_payload._id }).select('-password');
        if (admin) {
            return done(null, admin);
        }

        const mentor = await Mentor_Schema.findOne({ _id: jwt_payload._id }).select('-password');
        if (mentor) {
            return done(null, mentor);
        }

        const student = await Student_Schema.findOne({ _id: jwt_payload._id }).select('-password');
        if (student) {
            return done(null, student);
        }

        return done(null, false); // No user found
    } catch (error) {
        return done(error, false); // Return the error instead of `err` for consistency
    }
}));
