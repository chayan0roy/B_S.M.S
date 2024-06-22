import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteBatch, isFalseNotice } from '../store/slice/BatchSlice';
import { isFalseSubject } from '../store/slice/SubjectSlice';
import { isFalseMentor } from '../store/slice/MentorSlice';
import { isFalseStudent } from '../store/slice/StdentSlice';


import { Routes, Route, Navigate, Link } from "react-router-dom";

import AdminHomePage from './adminPages/AdminHomePage';
import AdminProfilePage from './adminPages/AdminProfilePage';

// Batch Realated
import A_Batch from './adminPages/batchRelated/A_Batch';
import A_Create_Batch from './adminPages/batchRelated/A_Create_Batch';
import A_View_Batch from './adminPages/batchRelated/A_View_Batch';

// Subject Realated
import A_Add_Subject from './adminPages/subjectRelated/A_Add_Subject';
import A_Subject from './adminPages/subjectRelated/A_Subject';
import A_View_Subject from './adminPages/subjectRelated/A_View_Subject';

// Mentor Realated
import A_Choose_Mentor from './adminPages/mentorRelated/A_Choose_Mentor';
import A_Mentor from './adminPages/mentorRelated/A_Mentor';
import A_View_Mentors from './adminPages/mentorRelated/A_View_Mentors';

// Student Realated
import A_Add_Student from './adminPages/studentRelated/A_Add_Student';
import A_Student from './adminPages/studentRelated/A_Student';
import A_Complain from './adminPages/studentRelated/A_Complain';
import A_Payment_History from './adminPages/studentRelated/A_Payment_History';
import A_View_Complain from './adminPages/studentRelated/A_View_Complain';
import A_View_Student from './adminPages/studentRelated/A_View_Student';

// Notice Realated
import A_Create_Notice from './adminPages/noticeRelated/A_Create_Notice';
import A_Notice from './adminPages/noticeRelated/A_Notice';
import A_Notice_List from './adminPages/noticeRelated/A_Notice_List';
import A_View_Notice from './adminPages/noticeRelated/A_View_Notice';


export default function AdminDashboard() {
	const dispatch = useDispatch();


	const go_A_Subject = () => {
		dispatch(deleteBatch());
		dispatch(isFalseSubject());
	}
	const go_A_Mentor = () => {
		dispatch(deleteBatch());
		dispatch(isFalseMentor());
	}
	const go_A_Student = () => {
		dispatch(deleteBatch());
		dispatch(isFalseStudent());
	}
	const go_A_Notice = () => {
		dispatch(deleteBatch());
		dispatch(isFalseNotice());
	}


	return (
		<div className='AdminDashboard pt-20'>
			<div className='left'>
				<Link className='link' to="/AdminHomePage">Home</Link>
				<Link className='link' to="/A_Batch">Batch</Link>
				<Link className='link' onClick={go_A_Subject} to="/A_Subject">Subject</Link>
				<Link className='link' onClick={go_A_Mentor} to="/A_Mentor">Mentor</Link>
				<Link className='link' onClick={go_A_Student} to="/A_Student">Student</Link>
				<Link className='link' onClick={go_A_Notice} to="/A_Notice">Notice</Link>
				<Link className='link' to="/AdminProfilePage">Profile Page</Link>
			</div>
			<div className='right'>
				<Routes>
					<Route path="/" element={<AdminHomePage />} />
					<Route path='*' element={<Navigate to="/" />} />
					<Route path="/AdminHomePage" element={<AdminHomePage />} />
					<Route path="/AdminProfilePage" element={<AdminProfilePage />} />

					<Route path="/A_Batch" element={<A_Batch />} />
					<Route path="/A_Create_Batch" element={<A_Create_Batch />} />
					<Route path="/A_View_Batch" element={<A_View_Batch />} />

					<Route path="/A_Add_Subject" element={<A_Add_Subject />} />
					<Route path="/A_Subject" element={<A_Subject />} />
					<Route path="/A_View_Subject" element={<A_View_Subject />} />

					<Route path="/A_Choose_Mentor" element={<A_Choose_Mentor />} />
					<Route path="/A_Mentor" element={<A_Mentor />} />
					<Route path="/A_View_Mentors" element={<A_View_Mentors />} />

					<Route path="/A_Add_Student" element={<A_Add_Student />} />
					<Route path="/A_Student" element={<A_Student />} />
					<Route path="/A_Complain" element={<A_Complain />} />
					<Route path="/A_Payment_History" element={<A_Payment_History />} />
					<Route path="/A_View_Complain" element={<A_View_Complain />} />
					<Route path="/A_View_Student" element={<A_View_Student />} />

					<Route path="/A_Create_Notice" element={<A_Create_Notice />} />
					<Route path="/A_Notice" element={<A_Notice />} />
					<Route path="/A_Notice_List" element={<A_Notice_List />} />
					<Route path="/A_View_Notice" element={<A_View_Notice />} />
				</Routes>
			</div>
		</div>
	)
}
