const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const { uploads } = require('../middleware/multer');
const generateTokens = require('../utils/generateTokens.js');

const Admin_Schima = require('../models/admin');
const AdminId_Schima = require('../models/adminID');
const Batch_Schima = require('../models/batch');
const Student_Schima = require('../models/student');
const Mentor_Schima = require('../models/mentor');



// register
router.post('/register', uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { name, id, email, password, mobileNumber, role } = req.body;

        if (!name || !id || !email || !password || !mobileNumber || !role) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingAdmin = await Admin_Schima.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ status: "failed", message: "Email already exists" });
        }

        const preAdminIDExist = await AdminId_Schima.findOne({ id: id });
        if (!preAdminIDExist) {
            return res.status(400).json({ status: false, message: 'Admin ID is invalid' });
        }
        if (preAdminIDExist.AdminId) {
            return res.status(400).json({ status: false, message: 'Admin ID is already associated with another admin' });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await new Admin_Schima({ profileIMG, name, mobileNumber, email, password: hashedPassword, role }).save();

        preAdminIDExist.AdminId = response._id.toString();
        await preAdminIDExist.save();

        const { auth_token } = await generateTokens(newUser);

        res.status(201).json({
            status: true,
            role: newUser.role,
            auth_token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "failed", message: "Unable to Register, please try again later" });
    }
});


// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
console.log(email);
console.log(password);
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "Email and password are required" });
        }

        const user = await Admin_Schima.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Invalid Email r Password" });
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
        res.json({ status: true, existingAdmin: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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

        const existingAdmin = req.user;

        existingAdmin.profileIMG = profileIMG;
        await existingAdmin.save();

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

        const existingAdmin = await Admin_Schima.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, existingAdmin.password);
        if (!isMatch) {
            return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        existingAdmin.password = hashedPassword;
        await existingAdmin.save();

        res.json({ status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// createBatch
router.post('/createBatch', uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { batchName, courseName, subject, admissionFees, monthlyFees, totalFees, classStartDate, session, studentIdCounter, classTime } = req.body;

        const isBatch = await Batch_Schima.findOne({ batchName: batchName });
        if (isBatch) {
            return res.status(400).json({ status: false, error: 'Batch Name already exists' });
        }
        const isAdmissionOpen = true;
        const batch = new Batch_Schima({ profileIMG, batchName, courseName, admissionFees, monthlyFees, totalFees, classStartDate, session, studentIdCounter, classTime, isAdmissionOpen });
        await batch.save();
        batch.subjectList.push(subject);
        await batch.save();
        res.status(200).json({ status: true });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// getAllBatch
router.post('/getAllBatch', async (req, res) => {
    try {

        const data = await Batch_Schima.find();

        if (!data) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        const newArray = data.map(item => ({
            id: item._id,
            batchName: item.batchName,
            courseName: item.courseName,
            admissionFees: item.admissionFees,
            monthlyFees: item.monthlyFees,
            totalFees: item.totalFees,
            classStartDate: item.classStartDate,
            session: item.session,
            classTime: item.classTime,
            studentDataList: item.studentDataList,
            mentorDataList: item.mentorDataList,
        }));

        return res.status(200).json({ status: true, batchData: newArray });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getBatchAllData
router.post('/getBatchAllData/:id', async (req, res) => {
    try {
        const data = await Batch_Schima.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }
        return res.status(200).json({ status: true, batchData: data });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// deleteBatch
router.delete('/deleteBatch/:id', async (req, res) => {
    try {
        const batchId = req.params.id;
        const data = await Batch_Schima.findByIdAndDelete(batchId);

        if (!data) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        return res.status(200).json({ status: true });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




// addSubject
router.post('/addSubject', async (req, res) => {
    try {
        const { batchID, subjectName } = req.body;

        const batch = await Batch_Schima.findOne({ _id: batchID });

        if (!batch) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        batch.subjectList.push(subjectName);
        await batch.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getAllSubject
router.get('/getAllSubject', async (req, res) => {
    try {
        const batches = await Batch_Schima.find();

        const filteredBatches = batches.filter(batch => batch.subjectList.length !== 0);

        if (filteredBatches.length === 0) {
            return res.status(404).json({ status: false, error: 'No subjects found' });
        }

        const subjectData = filteredBatches.map(batch => ({
            batchName: batch.batchName,
            subjectList: batch.subjectList
        }));

        return res.json({ status: true, subjectData: subjectData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// deleteSubject
router.post('/deleteSubject', async (req, res) => {
    try {
        const { batchName, subject } = req.body;
        const batch = await Batch_Schima.findOne({ batchName });
        if (!batch) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }
        batch.subjectList = batch.subjectList.filter(item => item !== subject);
        await batch.save();
        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




// addNotice
router.post('/addNotice/:id', async (req, res) => {
    try {
        const data = await Batch_Schima.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        const { noticeTitle, noticeBody } = req.body;

        data.noticeList = data.noticeList.concat(
            {
                noticeTitle: noticeTitle,
                noticeBody: noticeBody
            }
        )
        await data.save();
        return res.status(200).json({ status: true });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getAllNotice
router.get('/getAllNotice', async (req, res) => {
    try {
        const data = await Batch_Schima.find();

        if (data.length === 0) {
            return res.status(404).json({ status: false, error: 'Notice not found' });
        }

        const newArray = data.map(item => ({
            batchName: item.batchName,
            noticeList: item.noticeList
        }));

        return res.status(200).json({ status: true, noticeData: newArray });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// updateNotice
router.post('/updateNotice', async (req, res) => {
    try {
        const { batchName, noticeID, noticeTitle, noticeBody } = req.body;

        const data = await Batch_Schima.findOne({ batchName: batchName });

        if (!data) {
            return res.status(404).json({ status: false, error: 'Batch not found' });
        }

        data.noticeList.map((d) => {
            if (d._id == noticeID) {
                d.noticeTitle = noticeTitle;
                d.noticeBody = noticeBody;
            }
        })

        await data.save();
        return res.status(200).json({ status: true });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});





// getAllMentors
router.post('/getAllMentors', async (req, res) => {
    try {
        const data = await Mentor_Schima.find();

        if (!data) {
            return res.status(404).json({ status: false, error: 'Mentor not found' });
        }

        const newArray = data.map(item => ({
            id: item._id,
            profileIMG: item.profileIMG,
            name: item.name,
            mobileNumber: item.mobileNumber,
            subject: item.subject,
            email: item.email,
            batches: item.batches
        }));

        return res.status(200).json({ status: true, mentorData: newArray });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getMentorsAllData
router.post('/getMentorsAllData', async (req, res) => {
    try {
        const { mentorDataList } = req.body;
        const mentors = [];

        for (const d of mentorDataList) {
            const mentor = await Mentor_Schima.findById(d.mentorID);
            if (mentor) {
                mentors.push(mentor);
            } else {
                console.error("Mentor not found for ID:", d.mentorID);
            }
        }

        if (mentors.length !== 0) {
            return res.status(200).json({ status: true, mentorData: mentors });
        }
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




// deleteMentor
router.post('/deleteMentor', async (req, res) => {
    try {
        const { batchID, mentorID } = req.body;

        const existBatch = await Batch_Schima.findById(batchID);
        const exisMentor = await Mentor_Schima.findById(mentorID);

        if (!existBatch || !exisMentor) {
            return res.status(400).json({ status: false, error: 'd or Mentor not found' });
        }

        const updatedMentors = existBatch.mentorDataList.filter(id => id.mentorID !== mentorID);
        existBatch.mentorDataList = updatedMentors;
        await existBatch.save();

        const updatedBatch = exisMentor.batches.filter(id => id.batchID !== batchID);
        exisMentor.batches = updatedBatch;
        await exisMentor.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getAllMentorsData
router.post('/getAllMentorsData', async (req, res) => {
    try {
        const { batchID } = req.body;

        const data = await Mentor_Schima.find({}, { password: 0 });
        if (data.length === 0) {
            return res.status(404).json({ status: false, error: 'No mentors found' });
        }

        let dExists = [];

        for (const mentor of data) {
            if (mentor.batches && Array.isArray(mentor.batches) && mentor.batches.length !== 0) {
                let found = false;
                for (const id of mentor.batches) {
                    if (id.batchID === batchID) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    dExists.push(mentor);
                }
            } else {
                dExists.push(mentor);
            }
        }



        if (dExists.length !== 0) {
            return res.status(200).json({ status: true, mentorData: dExists });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// chooseMentor
router.post('/chooseMentor', async (req, res) => {
    try {
        const { mentorId, batchID } = req.body;

        const existBatch = await Batch_Schima.findById(batchID);
        const isMentor = await Mentor_Schima.findById(mentorId);

        if (!existBatch || !isMentor) {
            return res.status(404).json({ status: false, error: 'd or Mentor not found' });
        }

        const mentorAlreadyAssigned = existBatch.mentorDataList.some(mentorData => mentorData.mentorID === mentorId);
        if (!mentorAlreadyAssigned) {
            existBatch.mentorDataList.push({ mentorID: mentorId });
            await existBatch.save();
        }

        const dAlreadyAssigned = isMentor.batches.some(id => id.batchID === batchID);
        if (!dAlreadyAssigned) {
            isMentor.batches.push({ batchID: batchID });
            await isMentor.save();
        }

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getAllStudents
router.post('/getAllStudents', async (req, res) => {
    try {
        const data = await Student_Schima.find();

        if (!data) {
            return res.status(404).json({ status: false, error: 'Mentor not found' });
        }

        const newArray = data.map(item => ({
            id: item._id,
            profileIMG: item.profileIMG,
            name: item.name,
            batchName: item.batchName,
            mobileNumber: item.mobileNumber,
            whatsappNumber: item.whatsappNumber,
            email: item.email,
            batches: item.batches
        }));

        return res.status(200).json({ status: true, studentData: newArray });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// getStudentsAllData
router.post('/getStudentsAllData', async (req, res) => {
    try {
        const { studentDataList } = req.body;
        const students = [];

        for (const data of studentDataList) {
            const student = await Student_Schima.findById(data.studentID);
            if (student) {
                const { password, ...studentWithoutPassword } = student.toObject();
                students.push(studentWithoutPassword);
            } else {
                console.error("Student not found for ID:", data.studentID);
            }
        }

        if (students.length !== 0) {
            return res.status(200).json({ status: true, studentData: students });
        } else {
            return res.status(404).json({ status: false, error: 'No students found' });
        }
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

router.post('/getAllStudentsData', async (req, res) => {
    try {
        const { batchName } = req.body;

        const data = await Student_Schima.find({}, { password: 0 });
        if (data.length === 0) {
            return res.status(404).json({ status: false, error: 'No mentors found' });
        }

        let bexists = [];


        for (const student of data) {
            if (student.batchData && Array.isArray(student.batchData) && student.batchData.length !== 0) {
                let found = false;
                for (const batchNames of student.batchData) {
                    if (batchNames.batchName === batchName) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    bexists.push(student);
                }
            }
        }

        if (bexists.length !== 0) {
            return res.status(200).json({ status: true, studentData: bexists });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




// approveStudent
router.post('/approveStudent', async (req, res) => {
    try {

        const { studentID, batchID } = req.body;

        const existBatch = await Batch_Schima.findById(batchID);
        const isSutdent = await Student_Schima.findById(studentID);

        if (!existBatch || !isSutdent) {
            return res.status(404).json({ status: false, error: 'd or Mentor not found' });
        }

        existBatch.studentIdCounter = existBatch.studentIdCounter + 1;
        const studentRoll = existBatch.studentIdCounter;
        const dueFees = existBatch.totalFees;
        isSutdent.batches = isSutdent.batches.concat({
            batchID: batchID,
            studentRoll: studentRoll,
            dueFees: dueFees,
            learningPurpus: isSutdent.batchData.whyLearn
        })
        const getId = await isSutdent.save();


        existBatch.studentDataList = existBatch.studentDataList.concat({ studentID: getId._id.toString() })
        await existBatch.save();

        isSutdent.batchData = isSutdent.batchData.filter(id => id.batchName !== existBatch.batchName);
        await isSutdent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// viewPayment
router.post('/viewPayment', async (req, res) => {
    try {
        const { batchID, studentID } = req.body

        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }

        let data;

        existingStudent.batches.find((batch) => {
            if (batch.batchID === batchID) {
                data = batch.paymentHistory;
            }
        });

        return res.status(200).json({ status: true, paymentData: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// approvePayment
router.post('/approvePayment', async (req, res) => {
    try {
        const { batchID, studentID, paymentID } = req.body;

        const existingStudent = await Student_Schima.findById(studentID);
        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }

        const batch = existingStudent.batches.find(batch => batch.batchID === batchID);
        if (!batch) {
            return res.status(400).json({ status: false, error: 'Batch not found' });
        }

        const payment = batch.paymentHistory.find(payment => payment._id.toString() === paymentID);
        if (!payment) {
            return res.status(400).json({ status: false, error: 'Payment not found' });
        }

        batch.dueFees -= payment.amount;
        payment.isApprove = true;

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// rejectPayment
router.post('/rejectPayment', async (req, res) => {
    try {
        const { batchID, studentID, paymentID } = req.body;

        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: 'User not found' });
        }

        // Find the batch and payment to delete
        const batch = existingStudent.batches.find(batch => batch.batchID === batchID);
        if (!batch) {
            return res.status(400).json({ status: false, error: 'Batch not found' });
        }

        const paymentIndex = batch.paymentHistory.findIndex(payment => payment._id.toString() === paymentID);
        if (paymentIndex === -1) {
            return res.status(400).json({ status: false, error: 'Payment not found' });
        }

        // Remove the payment from the payment history
        batch.paymentHistory.splice(paymentIndex, 1);

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});





module.exports = router;
