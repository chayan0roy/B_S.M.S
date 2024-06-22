const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { uploads } = require('../middleware/multer');
const generateTokens = require('../utils/generateTokens.js');

const Student_Schima = require('../models/student');
const Batch_Schima = require('../models/batch');

const sendOtpVerificationEmail = require('../utils/sendOtpVerificationEmail.js');
const sendPasswordVerificationEmail = require('../utils/sendPasswordVerificationEmail.js');
const EmailVerificationModel = require('../models/EmailVerification.js');


// register 
router.post('/register', uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { name, email, password, mobileNumber, whatsappNumber, address, role } = req.body;

        if (!name || !email || !password || !mobileNumber || !whatsappNumber || !address || !role) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingStudent = await Student_Schima.findOne({ email });
        if (existingStudent) {
            return res.status(409).json({ status: "failed", message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await new Student_Schima({ profileIMG, name, email, password: hashedPassword, mobileNumber, whatsappNumber, address, role }).save();
        sendOtpVerificationEmail(req, res, newUser);

        res.status(201).json({
            status: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "failed", message: "Unable to Register, please try again later" });
    }
});


// User Email Verification
router.post('/verifyEmail', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingStudent = await Student_Schima.findOne({ email });

        if (!existingStudent) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
        }

        if (existingStudent.is_verified) {
            return res.status(400).json({ status: "failed", message: "Email is already verified" });
        }

        const emailVerification = await EmailVerificationModel.findOne({ userId: existingStudent._id, otp });
        if (!emailVerification) {
            if (!existingStudent.is_verified) {
                await sendEmail(req, res, existingStudent)
                return res.status(400).json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" });
            }
            return res.status(400).json({ status: "failed", message: "Invalid OTP" });
        }

        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmail(req, res, existingStudent)
            return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
        }

        existingStudent.is_verified = true;
        await existingStudent.save();

        const { auth_token } = await generateTokens(existingStudent)

        await EmailVerificationModel.deleteMany({ userId: existingStudent._id });
        res.status(200).json({
            status: true,
            role: existingStudent.role,
            auth_token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to verify email, please try again later" });
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "Email and password are required" });
        }

        const user = await Student_Schima.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Invalid Email or Password" });
        }

        if (!user.is_verified) {
            return res.status(401).json({ status: "failed", message: "Your account is not verified" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }

        const { auth_token } = await generateTokens(user);
        res.status(200).json({
            status: true,
            role: user.role,
            auth_token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to login, please try again later" });
    }
});




// Get Profile
router.post('/getProfile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        res.json({ status: true, existingStudent: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/sendUserPasswordResetEmail', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "failed", message: "Email field is required" });
        }
        const user = await Student_Schima.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
        }

        sendPasswordVerificationEmail(req, res, user);

        res.status(200).json({ status: true, message: "Password reset email sent. Please check your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to send password reset email. Please try again later." });
    }
})

// Password Reset
router.post('/userPasswordReset/:id/:token', async (req, res) => {
    try {
        const { newPassword, confromPassword } = req.body;
        const { id, token } = req.params;

        const user = await Student_Schima.findById(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const new_secret = user._id + process.env.JWT_TOKEN_SECRET_KEY;
        jwt.verify(token, new_secret);

        if (!newPassword || !confromPassword) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password are required" });
        }

        if (newPassword !== confromPassword) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password don't match" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Student_Schima.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });

        res.status(200).json({ status: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ status: "failed", message: "Token expired. Please request a new password reset link." });
        }
        return res.status(500).json({ status: "failed", message: "Unable to reset password. Please try again later." });
    }
});

// Update Profile Image
router.post('/updateProfileImage', passport.authenticate('jwt', { session: false }), uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const existingStudent = req.user;

        existingStudent.profileIMG = profileIMG;
        await existingStudent.save();

        res.json({ status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Password
router.post('/updatePassword', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ status: "failed", message: "Current and new passwords are required" });
        }

        const existingStudent = await Student_Schima.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, existingStudent.password);
        if (!isMatch) {
            return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        existingStudent.password = hashedPassword;
        await existingStudent.save();

        res.json({ status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// getAllCouece
router.get('/getAllCouece', async (req, res) => {
    try {
        const data = await Batch_Schima.find();

        if (!data || data.length === 0) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newArray = [];

        for (const item of data) {
            const classStartDate = new Date(item.classStartDate);
            classStartDate.setHours(0, 0, 0, 0);
            if (item.isAdmissionOpen) {

                if (classStartDate.getTime() <= today.getTime()) {
                    item.isAdmissionOpen = false;
                    await item.save();
                }
            }

            if (item.isAdmissionOpen) {
                newArray.push(item);
            }
        }

        return res.status(200).json({ status: true, batchData: newArray });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


router.post('/checkAuth', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const studentID = req.user;
        const existingStudent = await Student_Schima.findById(studentID);
        if (existingStudent) {
            return res.status(200).json({ status: true });
        } else {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// register
router.post('/register', uploads.single('image'), async (req, res) => {

    try {
        let profileIMG;
        if (req.file == undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { name, role, mobileNumber, whatsappNumber, address, email, password } = req.body;

        const existingStudent = await Student_Schima.findOne({ email: email });
        if (existingStudent) {
            return res.status(400).json({ error: 'Student already exists' });
        }

        const student = new Student_Schima({ profileIMG, name, role, mobileNumber, whatsappNumber, address, email, password });
        const response = await student.save();

        const payload = {
            id: response._id
        }
        const token = generateToken(payload);

        res.status(200).json({ status: true, auth_token: token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const isStudent = await Student_Schima.findOne({ email: email });
        if (!isStudent || !(await isStudent.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }
        const payload = {
            id: isStudent._id,
        }
        const token = generateToken(payload);
        res.json({ status: true, auth_token: token, role: isStudent.role })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// // getAllNewBatch
// router.post('/getAllNewBatch', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     try {
//         const studentID = req.user;
//         const existingStudent = await Student_Schima.findById(studentID);

//         if (!existingStudent) {
//             return res.status(400).json({ status: false, error: 'User not found' });
//         }

//         const data = await Batch_Schima.find();

//         if (!data) {
//             return res.status(404).json({ status: false, error: 'Batch not found' });
//         }

//         const newArray = data.filter(item => item.isAdmissionOpen === true);

//         return res.status(200).json({ status: true, batchData: newArray });
//     } catch (err) {
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ status: false, error: 'Invalid token' });
//         }
//         console.error(err);
//         return res.status(500).json({ status: false, error: 'Internal Server Error' });
//     }
// });


// registerNewBatch



router.post('/registerNewBatch', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const existingStudent = req.user;
        
        const { id, whyLearn } = req.body;
        const isBatch = await Batch_Schima.findById(id);
        if (!isBatch) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        let isExists = existingStudent.batchData.some(item => item.batchName === isBatch.batchName);

        if (isExists) {
            return res.status(404).json({ status: false, error: 'You already registered' });
        }

        let isAlreadyExists = existingStudent.batches.some(item => item.batchID === isBatch._id.toString());

        if (isAlreadyExists) {
            return res.status(404).json({ status: false, error: 'You already registered' });
        }

        existingStudent.batchData.push({
            batchName: isBatch.batchName,
            whyLearn: whyLearn
        });

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// getAllRegisteredBatch
router.post('/getAllRegisteredBatch', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const studentID = req.user;
        const existingStudent = await Student_Schima.findById(studentID);
        const newArray = [];
        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }

        if (existingStudent.batches.length !== 0) {
            await Promise.all(existingStudent.batches.map(async (id) => {
                newArray.push(await Batch_Schima.findById(id.batchID));
            }));
        }

        return res.status(200).json({ status: true, batchData: newArray });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// submitPayment
router.post('/submitPayment', passport.authenticate('jwt', { session: false }), uploads.single('image'), async (req, res) => {
    try {
        const studentID = req.user;
        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
        const img = req.file.filename;
        const { amount, batchID } = req.body

        existingStudent.batches.find((batch) => {
            if (batch.batchID === batchID) {
                batch.paymentHistory.push({
                    screenshort: img,
                    amount: amount,
                    isApprove: false
                });
            }
        });

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// viewPayment
router.post('/viewPayment', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const studentID = req.user;
        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
        const { batchID } = req.body

        let data;

        existingStudent.batches.find((batch) => {
            if (batch.batchID === batchID) {
                data = batch.paymentHistory;
            }
        });

        return res.status(200).json({ status: true, paymentData: data });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});



module.exports = router;