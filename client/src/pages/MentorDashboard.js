import React from 'react'
import { Routes, Route, Navigate, Link } from "react-router-dom";

import MentorProfilePage from './mentorPages/MentorProfilePage';
import M_Batch from './mentorPages/batchRelated/M_Batch';
import M_View_Batch from './mentorPages/batchRelated/M_View_Batch';
import M_Subject from './mentorPages/subjectRelated/M_Subject';
import M_Student from './mentorPages/studentRelated/M_Student';
import M_View_Student from './mentorPages/studentRelated/M_View_Student';
import M_Add_Student from './mentorPages/studentRelated/M_Add_Student';
import M_Payment_History from './mentorPages/studentRelated/M_Payment_History';
import M_Notice from './mentorPages/noticeRelated/M_Notice';



export default function MentorDashboard() {

	return (
		<div className='MentorDashboard pt-20'> 
			<div className='left'>
				<Link className='link' to="/M_Batch">Batch</Link>
				<Link className='link' to="/MentorProfilePage">Profile Page</Link>
			</div>
			<div className='right'>
				<Routes>
					<Route path="/" element={<M_Batch />} />
					<Route path='*' element={<Navigate to="/" />} />
					<Route path="/M_Batch" element={<M_Batch />} />
					<Route path="/MentorProfilePage" element={<MentorProfilePage />} />
					<Route path="/M_View_Batch" element={<M_View_Batch />} />
					<Route path="/M_Subject" element={<M_Subject />} />
					<Route path="/M_Student" element={<M_Student />} />
					<Route path="/M_View_Student" element={<M_View_Student />} />
					<Route path="/M_Add_Student" element={<M_Add_Student />} />
					<Route path="/M_Payment_History" element={<M_Payment_History />} />
					<Route path="/M_Notice" element={<M_Notice />} />
				</Routes>
			</div>
		</div>
	)
}





// M_Notice
