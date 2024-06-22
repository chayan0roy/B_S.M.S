import totalStudentImg from './assets/img1.png'
import totalBatchesImg from './assets/img2.png'
import totalMentorsImg from './assets/img3.png'
import totalFeesCollectionImg from './assets/img4.png'

const adminHomeCardData = [
    {
        img: totalStudentImg,
        title: "Total Students",
        count: "60"
    },
    {
        img: totalBatchesImg,
        title: "Total Batches",
        count: "9"
    },
    {
        img: totalMentorsImg,
        title: "Total Mentors",
        count: "6"
    },
    {
        img: totalFeesCollectionImg,
        title: "Total Fees Collection",
        count: "5000"
    },
]


const noticeData = [
    {
        title: "ndscvndsvcn",
        details: "cnbsvdncvsdncvhsdcsdvchdscnbdshc",
        date: "20/7/2025"
    },
    {
        title: "Roy",
        details: "dfgdfghgjcsdgdhbcvnfgngfn",
        date: "2/12/2025"
    },
    {
        title: " nbzcj",
        details: "dfnfgnfgsdcvlkfv;ewfew",
        date: "10/10/2025"
    },
    {
        title: "Ram",
        details: "fwefkwefiwefwveufh;ca vcuasc",
        date: "9/1/2025"
    }
];


const batchData = [
    {
        batchName: "Batch 13",
        sbjectName: ["Graphic ", "Development"],
        toalStdents: "60",
        mentors: ["Hasan Da ", "Sudip Da"]
    },
    {
        batchName: "Batch 14",
        sbjectName: ["Development"],
        toalStdents: "90",
        mentors: ["Sudip Da"]
    },
    {
        batchName: "Batch 15",
        sbjectName: ["Graphic"],
        toalStdents: "50",
        mentors: ["Hasan Da"]
    },
    {
        batchName: "Batch 16",
        sbjectName: ["Development ", "Bloging"],
        toalStdents: "40",
        mentors: ["Sudip Da ", "Souvik Da"]
    },
];


const subjectData = [
    {
        subjectName: "Graphic",
        batchName: "Batch 13",
        mentors: ["Hasan Da"]
    },
    {
        subjectName: "Development",
        batchName: "Batch 14",
        mentors: ["Sudip Da"]
    },
    {
        subjectName: "Blogging",
        batchName: "Batch 15",
        mentors: ["Souvik Da"]
    },
    {
        subjectName: "AI",
        batchName: "Batch 15",
        mentors: ["Anirban Da ", "Hasan Da"]
    }
];


const mentorData = [
    {
        mentorName: "Hasan Da",
        mentorEmail: "tyhasan@gmail.com",
        subjectName: "Graphic",
        totalBatch: "5"
    },
    {
        mentorName: "Sudip Da",
        mentorEmail: "tyhasan@gmail.com",
        subjectName: "Development",
        totalBatch: "8"
    },
    {
        mentorName: "Sukanta Da",
        mentorEmail: "tyhasan@gmail.com",
        subjectName: "Development",
        totalBatch: "9"
    },
    {
        mentorName: "Souvik Da",
        mentorEmail: "tyhasan@gmail.com",
        subjectName: "Blogging",
        totalBatch: "3"
    }
];


const studentData = [
    {
        studentName: "Roy",
        studentemail: "Roy@gmail.com",
        subjectName: "Graphic",
        batchName: "Batch 13"
    },
    {
        studentName: "Sham",
        studentemail: "Roy@gmail.com",
        subjectName: "Blogging",
        batchName: "Batch 13"
    },
    {
        studentName: "Jadu",
        studentemail: "Roy@gmail.com",
        subjectName: "Development",
        batchName: "Batch 14"
    },
    {
        studentName: "Raja",
        studentemail: "Roy@gmail.com",
        subjectName: "Development",
        batchName: "Batch 15"
    }
];


const complainData = [
    {
        studentName: "Roy",
        studentemail: "Roy@gmail.com",
        subjectName: "Graphic",
        batchName: "Batch 13"
    },
    {
        studentName: "Roy",
        studentemail: "Roy@gmail.com",
        subjectName: "Graphic",
        batchName: "Batch 13"
    },
    {
        studentName: "Roy",
        studentemail: "Roy@gmail.com",
        subjectName: "Graphic",
        batchName: "Batch 13"
    },
    {
        studentName: "Roy",
        studentemail: "Roy@gmail.com",
        subjectName: "Graphic",
        batchName: "Batch 13"
    }
];




const paymentHistory = [
    {
        id: "jdg3552532524",
        date: "21/2/2024",
        img: "",
        amount: 100,
        isApprove: false
    },
    {
        id: "jdg3552fd524",
        date: "5/6/2024",
        img: "",
        amount: 200,
        isApprove: true
    },
    {
        id: "jdg544532524",
        date: "3/8/2024",
        img: "",
        amount: 800,
        isApprove: false
    }
];

export { adminHomeCardData, noticeData, batchData, subjectData, mentorData, studentData, complainData, paymentHistory };





const batches = [
    {
        batchPassword: "54asdca",
        studentID: 5465345665,
        learningPurpus: "jvhgd vjvsvdsvsdhv",
        dueFees: 52000,
        paymentHistory: [
            {
                screenshort: "fbdfdfdfb",
                date: 20 / 22 / 21,
                amount: 5000,
                isApprove: false
            }
        ],
        complains: [
            {
                date: 20 / 22 / 21,
                complain: "hgfdjgdjb hgsfvsdn vfs dfhgsdvfs"
            }
        ],
    },
    {
        batchPassword: "54asdca",
        studentID: 5465345665,
        learningPurpus: "jvhgd vjvsvdsvsdhv",
        dueFees: 52000,
        paymentHistory: [
            {
                screenshort: "fbdfdfdfb",
                date: 20 / 22 / 21,
                amount: 5000,
                isApprove: false
            },
            {
                screenshort: "fbdfdfdfb",
                date: 20 / 22 / 21,
                amount: 5000,
                isApprove: false
            },
            {
                screenshort: "fbdfdfdfb",
                date: 20 / 22 / 21,
                amount: 5000,
                isApprove: false
            }
        ],
        complains: [
            {
                date: 20 / 22 / 21,
                complain: "hgfdjgdjb hgsfvsdn vfs dfhgsdvfs"
            },
            {
                date: 20 / 22 / 21,
                complain: "hgfdjgdjb hgsfvsdn vfs dfhgsdvfs"
            },
            {
                date: 20 / 22 / 21,
                complain: "hgfdjgdjb hgsfvsdn vfs dfhgsdvfs"
            }
        ],
    }
]