const mongoose = require("mongoose");

const AdminID = new mongoose.Schema({
    id: {
        type: String
    },
    AdminId: {
        type: String
    }
})


const AdminId_Schima = mongoose.model("adminids", AdminID);
module.exports = AdminId_Schima;