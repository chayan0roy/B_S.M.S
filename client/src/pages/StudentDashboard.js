import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import StudentProfilePage from "./studentPages/StudentProfilePage";
import S_Batch from "./studentPages/batchRelated/S_Batch";
import S_View_Batch from "./studentPages/batchRelated/S_View_Batch";
import S_FeesPayment from "./studentPages/FeesPayment/S_FeesPayment";
import S_ViewPayment from "./studentPages/FeesPayment/S_ViewPayment";
import S_Notice_List from "./studentPages/noticeRelated/S_Notice_List";
import S_View_Notice from "./studentPages/noticeRelated/S_View_Notice";
import S_Home_Work from "./studentPages/others/S_Home_Work";

export default function StudentDashboard() {
  return (
    <div className="StudentDashboard pt-20">
      <div className="left">
        <Link className="link" to="/S_Batch">Batch</Link>
        <Link className="link" to="/StudentProfilePage">Profile Page</Link>
      </div>
      <div className="right">
        <Routes>
          <Route path="/" element={<S_Batch />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/S_Batch" element={<S_Batch />} />
          <Route path="/StudentProfilePage" element={<StudentProfilePage />} />
          <Route path="/S_View_Batch" element={<S_View_Batch />} />
          <Route path="/S_FeesPayment" element={<S_FeesPayment />} />
          <Route path="/S_ViewPayment" element={<S_ViewPayment />} />
          <Route path="/S_Notice_List" element={<S_Notice_List />} />
          <Route path="/S_View_Notice" element={<S_View_Notice />} />
          <Route path="/S_Home_Work" element={<S_Home_Work />} />
        </Routes>
      </div>
    </div>
  );
}
