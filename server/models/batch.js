const mongoose = require('mongoose');

const Batch = new mongoose.Schema({
    profileIMG: {
        type: String
    },
    batchName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    admissionFees: {
        type: Number,
    },
    monthlyFees: {
        type: Number,
    },
    totalFees: {
        type: Number,
    },
    classStartDate: {
        type: Date,
    },
    session: {
        type: String
    },
    studentIdCounter: {
        type: Number
    },
    classTime: {
        type: String,
    },
    isAdmissionOpen: {
        type: Boolean,
    },
    subjectList: {
        type: Array
    },
    studentDataList: [{
        studentID: {
            type: String,
        }
    }],
    mentorDataList: [{
        mentorID: {
            type: String,
        }
    }],
    homeWorkList: [{
        date: {
            type: Date,
        },
        work: {
            type: String,
        }
    }],
    studyMAterialList: [{
        date: {
            type: Date,
        },
        material: {
            type: String,
        }
    }],
    noticeList: [{
        date: {
            type: Date,
        },
        noticeTitle: {
            type: String,
        },
        noticeBody: {
            type: String,
        }
    }],
})

const Batch_Schima = mongoose.model("batches", Batch);
module.exports = Batch_Schima;
