import React from 'react'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slice/AuthSlice.js';
import { deleteBatchList, deleteBatchID, deleteBatch, deleteNoticeList, deleteNotice, isFalseNotice } from '../../store/slice/BatchSlice.js';
import { dashboardFalse } from '../../store/slice/DashBoardSlice.js';
import { deleteMentorList, deleteMentor, isFalseMentor } from '../../store/slice/MentorSlice.js';
import { deleteStudentList, deleteStudent, isFalseStudent } from '../../store/slice/StdentSlice.js';
import { deleteSubjectList, isFalseSubject } from '../../store/slice/SubjectSlice.js';
import Button from '../../components/button/Button.js';
import { useNavigate } from 'react-router-dom';


export default function StudentProfilePage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogot = () => {
		Cookies.remove('auth_token');
		Cookies.remove('role');
		dispatch(deleteBatchList());
		dispatch(deleteBatchID());
		dispatch(deleteBatch());
		dispatch(deleteNoticeList());
		dispatch(deleteNotice());
		dispatch(isFalseNotice());
		dispatch(dashboardFalse());
		dispatch(deleteMentorList());
		dispatch(deleteMentor());
		dispatch(isFalseMentor());
		dispatch(deleteStudentList());
		dispatch(isFalseStudent());
		dispatch(deleteStudent());
		dispatch(deleteSubjectList());
		dispatch(isFalseSubject());
		dispatch(logout());
		navigate('/');
	}

	return (
		<div>
			StudentProfilePage
			<Button fun={() => handleLogot()} title={"Logout"} />
		</div>
	)
}
