const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const { uploads } = require("../middleware/multer");
const generateTokens = require("../utils/generateTokens.js");

const Mentor_Schima = require("../models/mentor");
const MentorId_Schima = require("../models/mentorID");
const Student_Schima = require("../models/student");
const Batch_Schima = require("../models/batch");

// register
router.post("/register", uploads.single("image"), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { name, id, subject, email, password, mobileNumber, role } = req.body;

        if (
            !name ||
            !id ||
            !email ||
            !password ||
            !subject ||
            !mobileNumber ||
            !role
        ) {
            return res
                .status(400)
                .json({ status: "failed", message: "All fields are required" });
        }

        const existingMentor = await Mentor_Schima.findOne({ email });
        if (existingMentor) {
            return res
                .status(409)
                .json({ status: "failed", message: "Email already exists" });
        }

        const preMentorIDExist = await MentorId_Schima.findOne({ id: id });
        if (!preMentorIDExist) {
            return res
                .status(400)
                .json({ status: false, message: "Mentor ID is invalid" });
        }
        if (preMentorIDExist.MentorId) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "Mentor ID is already associated with another admin",
                });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await new Mentor_Schima({
            profileIMG,
            name,
            subject,
            mobileNumber,
            email,
            password: hashedPassword,
            role,
        }).save();

        preMentorIDExist.MentorId = response._id.toString();
        await preMentorIDExist.save();

        const { auth_token } = await generateTokens(newUser);

        res.status(201).json({
            status: true,
            role: newUser.role,
            auth_token,
        });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({
                status: "failed",
                message: "Unable to Register, please try again later",
            });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ status: "failed", message: "Email and password are required" });
        }

        const user = await Mentor_Schima.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ status: "failed", message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ status: "failed", message: "Invalid email or password" });
        }

        const { auth_token } = await generateTokens(user);

        res.status(200).json({
            status: true,
            role: user.role,
            auth_token,
        });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({
                status: "failed",
                message: "Unable to login, please try again later",
            });
    }
});

// Get Profile
router.post(
    "/getProfile",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            res.json({ status: true, existingMentor: req.user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Update Profile Image
router.post(
    "/updateProfileImage",
    passport.authenticate("jwt", { session: false }),
    uploads.single("image"),
    async (req, res) => {
        try {
            let profileIMG;
            if (req.file === undefined) {
                profileIMG = "accont.png";
            } else {
                profileIMG = req.file.filename;
            }

            const existingMentor = req.user;

            existingMentor.profileIMG = profileIMG;
            await existingMentor.save();

            res.json({ status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Update Password
router.post(
    "/updatePassword",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res
                    .status(400)
                    .json({
                        status: "failed",
                        message: "Current and new passwords are required",
                    });
            }

            const existingMentor = await Mentor_Schima.findById(req.user._id);

            const isMatch = await bcrypt.compare(
                currentPassword,
                existingMentor.password
            );
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Invalid email or password" });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            existingMentor.password = hashedPassword;
            await existingMentor.save();

            res.json({ status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// getAllBatch
router.post("/getAllBatch", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const mentor = req.user;
        let newArray = [];

        await Promise.all(mentor.batches.map(async (batch) => {
            const batchData = await Batch_Schima.findOne({ _id: batch.batchID });
            if (batchData) {
                newArray.push({
                    id: batchData._id,
                    batchName: batchData.batchName,
                    courseName: batchData.courseName,
                    admissionFees: batchData.admissionFees,
                    monthlyFees: batchData.monthlyFees,
                    totalFees: batchData.totalFees,
                    classStartDate: batchData.classStartDate,
                    session: batchData.session,
                    classTime: batchData.classTime,
                    studentDataList: batchData.studentDataList,
                    mentorDataList: batchData.mentorDataList,
                });
            }
        }));

        return res.status(200).json({ status: true, batchData: newArray });
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ status: false, error: "Invalid token" });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: "Internal Server Error" });
    }
});


// getBatchAllData
router.post("/getBatchAllData/:id", async (req, res) => {
    try {
        const data = await Batch_Schima.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ status: false, error: "Batch not found" });
        }
        return res.status(200).json({ status: true, batchData: data });
    } catch (err) {
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

// getStudentsAllData
router.post("/getStudentsAllData", async (req, res) => {
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
            return res
                .status(404)
                .json({ status: false, error: "No students found" });
        }
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

// getAllNewBatch
router.post(
    "/getAllNewBatch",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const mentorID = req.user;
            const existingMentor = await Mentor_Schima.findById(mentorID);

            if (!existingMentor) {
                return res.status(400).json({ status: false, error: "User not found" });
            }

            const data = await Batch_Schima.find();

            if (!data) {
                return res
                    .status(404)
                    .json({ status: false, error: "Batch not found" });
            }

            const newArray = data.filter((item) => item.isAdmissionOpen === true);

            return res.status(200).json({ status: true, batchData: newArray });
        } catch (err) {
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ status: false, error: "Invalid token" });
            }
            console.error(err);
            return res
                .status(500)
                .json({ status: false, error: "Internal Server Error" });
        }
    }
);

// getAllRegisteredBatch
router.post(
    "/getAllRegisteredBatch",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const mentorID = req.user;
            const existingMentor = await Mentor_Schima.findById(mentorID);
            const newArray = [];
            if (!existingMentor) {
                return res.status(400).json({ status: false, error: "User not found" });
            }

            if (existingMentor.batches.length !== 0) {
                await Promise.all(
                    existingMentor.batches.map(async (id) => {
                        newArray.push(await Batch_Schima.findById(id.batchID));
                    })
                );
            }

            return res.status(200).json({ status: true, batchData: newArray });
        } catch (err) {
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ status: false, error: "Invalid token" });
            }
            console.error(err);
            return res
                .status(500)
                .json({ status: false, error: "Internal Server Error" });
        }
    }
);

router.post("/getAllStudentsData", async (req, res) => {
    try {
        const { batchName } = req.body;

        const data = await Student_Schima.find({}, { password: 0 });
        if (data.length === 0) {
            return res.status(404).json({ status: false, error: "No mentors found" });
        }

        let bexists = [];

        for (const student of data) {
            if (
                student.batchData &&
                Array.isArray(student.batchData) &&
                student.batchData.length !== 0
            ) {
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
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

router.post("/approveStudent", async (req, res) => {
    try {
        const { studentID, batchID } = req.body;

        const existBatch = await Batch_Schima.findById(batchID);
        const isSutdent = await Student_Schima.findById(studentID);

        if (!existBatch || !isSutdent) {
            return res
                .status(404)
                .json({ status: false, error: "d or Mentor not found" });
        }

        existBatch.studentIdCounter = existBatch.studentIdCounter + 1;
        const studentRoll = existBatch.studentIdCounter;
        const dueFees = existBatch.totalFees;
        isSutdent.batches = isSutdent.batches.concat({
            batchID: batchID,
            studentRoll: studentRoll,
            dueFees: dueFees,
            learningPurpus: isSutdent.batchData.whyLearn,
        });
        const getId = await isSutdent.save();

        existBatch.studentDataList = existBatch.studentDataList.concat({
            studentID: getId._id.toString(),
        });
        await existBatch.save();

        isSutdent.batchData = isSutdent.batchData.filter(
            (id) => id.batchName !== existBatch.batchName
        );
        await isSutdent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error("Internal Server Error:", err);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

// viewPayment
router.post("/viewPayment", async (req, res) => {
    try {
        const { batchID, studentID } = req.body;

        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: "User not found" });
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
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

// approvePayment
router.post("/approvePayment", async (req, res) => {
    try {
        const { batchID, studentID, paymentID } = req.body;

        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: "User not found" });
        }

        const batch = existingStudent.batches.find(
            (batch) => batch.batchID === batchID
        );

        if (!batch) {
            return res.status(400).json({ status: false, error: "Batch not found" });
        }

        const payment = batch.paymentHistory.find(
            (payment) => payment._id.toString() === paymentID
        );

        if (!payment) {
            return res
                .status(400)
                .json({ status: false, error: "Payment not found" });
        }

        batch.dueFees -= payment.amount;
        payment.isApprove = true;

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

// rejectPayment
router.post("/rejectPayment", async (req, res) => {
    try {
        const { batchID, studentID, paymentID } = req.body;

        const existingStudent = await Student_Schima.findById(studentID);

        if (!existingStudent) {
            return res.status(400).json({ status: false, error: "User not found" });
        }

        // Find the batch and payment to delete
        const batch = existingStudent.batches.find(
            (batch) => batch.batchID === batchID
        );
        if (!batch) {
            return res.status(400).json({ status: false, error: "Batch not found" });
        }

        const paymentIndex = batch.paymentHistory.findIndex(
            (payment) => payment._id.toString() === paymentID
        );
        if (paymentIndex === -1) {
            return res
                .status(400)
                .json({ status: false, error: "Payment not found" });
        }

        // Remove the payment from the payment history
        batch.paymentHistory.splice(paymentIndex, 1);

        await existingStudent.save();

        return res.status(200).json({ status: true });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
});

module.exports = router;
