import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addStudentList, deleteStudentList, addStudent } from '../../../store/slice/StdentSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function M_Student() {
	const dispatch = useDispatch();
	const navigate = useNavigate()

	let batchID = useSelector(state => state.batchData.batchID);
	let batch = useSelector(state => state.batchData.batch);
	let studentList = useSelector(state => state.studentData.studentList);

	const tableHeader = ["Student Name", "Student Email", "Batch Name", "Action"];

	useEffect(() => {
		if (batch && batch.studentDataList && batch.studentDataList.length !== 0) {
			Handle_Get_Students_All_Data();
		} else {
			dispatch(deleteStudentList());
		}
	}, []);


	const Handle_Get_Students_All_Data = async () => {
		try {
			const token = Cookies.get('auth_token');
			const role = Cookies.get('role');

			if (token && role === "Mentor") {
				const newArray = batch.studentDataList.map(item => ({ studentID: item.studentID }));
				if (newArray.length !== 0) {
					const result = await axios.post(
						`${process.env.REACT_APP_API_URL}/Mentor/getStudentsAllData`,
						{ studentDataList: newArray },
						{
							headers: {
								'Content-Type': 'application/json'
							}
						}
					);
					if (result.data.status === true) {
						dispatch(addStudentList(result.data.studentData));
					} else if (result.data.status === false) {
						alert(result.data.error || "Failed to fetch student data.");
					}
				} else {
					dispatch(deleteStudentList());
				}
			} else {
				alert("Unauthorized access or invalid role.");
			}
		} catch (error) {
			console.error("Error fetching student data:", error);
			alert("An error occurred while fetching student data.");
		}
	};


	const handleViewStudent = (d, batchID) => {
		dispatch(deleteStudentList()); 
		const data = {
			d: d,
			batchID: batchID
		}
		dispatch(addStudent(data));

		navigate('/M_View_Student');
	}


	const handleDeleteStudent = async (data) => {
		console.log(batchID);
		console.log(data._id);
		// const token = Cookies.get('auth_token');
		// const role = Cookies.get('role');

		// const requestData = {
		// 	batchID: batchID,
		// 	studentID: data._id
		// };

		// if (token && role && role === "Mentor") {
		// 	try {
		// 		const result = await axios.post(
		// 			`${process.env.REACT_APP_API_URL}/Mentor/deleteStudent`,
		// 			requestData,
		// 			{
		// 				headers: {
		// 					'Content-Type': 'application/json',
		// 					'Authorization': `Bearer ${token}`
		// 				}
		// 			}
		// 		);

		// 		if (result.data.status === true) {
		// 			Handle_Get_All_Students();
		// 		} else {
		// 			alert(result.data.message);
		// 		}
		// 	} catch (error) {
		// 		alert(error.message);
		// 	}
		// }
	}

	return (
		<div>
			<div>
				<table className="table">
					<tr>
						{
							tableHeader.map((th, index) => (
								<th key={index}>{th}</th>
							))
						}</tr>
					{
						studentList && studentList.length !== 0 ?
							studentList.map((d) => (
								<tr key={d.id}>
									<td>{d.name}</td>
									<td>{d.email}</td>
									<td>{d.batches.length}</td>
									<td className='tableBtnArea'>
										<Button fun={() => handleViewStudent(d, batchID)} title={"View"} />
										<Button fun={() => handleDeleteStudent(d)} title={"Delete From batch"} />
									</td>
								</tr>
							))
							:
							<tr>
								<td colSpan="5"><h1>No Student Found</h1></td>
							</tr>
					}

				</table>
			</div>
		</div >
	)
}