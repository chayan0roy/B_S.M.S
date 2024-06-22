import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { addBatchList, addBatchID, deleteBatch, isTrueNotice } from '../../../store/slice/BatchSlice.js';
import { isTrueSubject } from '../../../store/slice/SubjectSlice.js';
import { isTrueMentor } from '../../../store/slice/MentorSlice.js';
import { isTrueStudent } from '../../../store/slice/StdentSlice.js';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/button/Button.js';



export default function A_Batch() {
	const dispatch = useDispatch();
	const navigate = useNavigate()

	const batchList = useSelector(state => state.batchData.batchList);

	const tableHeader = ["Batch Name", "Course Name", "Toal Stdents", "Mentors", "Action"];


	useEffect(() => {
		Handle_Get_All_Batch();
	}, []);

	const Handle_Get_All_Batch = async () => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Admin") {
			try {
				const result = await axios.post(
					`${process.env.REACT_APP_API_URL}/Admin/getAllBatch`,
					null,
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);

				if (result.data.status === true) {
					dispatch(addBatchList(result.data.batchData));
				} else {
					alert(result.data.message);
				}
			} catch (error) {
				alert(error.message);
			}
		}
	};


	const Create_New_Batch = () => {
		navigate('/A_Create_Batch');
	}

	const handleViewBatch = (data) => {
		dispatch(addBatchID(data.id));

		dispatch(deleteBatch());
		dispatch(isTrueSubject());
		dispatch(isTrueMentor());
		dispatch(isTrueNotice());
		dispatch(isTrueStudent());
		navigate('/A_View_Batch');
	}


	const handleDeleteBatch = async (data) => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Admin") {
			try {
				const result = await axios.delete(
					`${process.env.REACT_APP_API_URL}/Admin/deleteBatch/${data.id}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);

				if (result.data.status === true) {
					Handle_Get_All_Batch();
				} else {
					alert(result.data.message);
				}
			} catch (error) {
				alert(error.message);
			}
		}
	};



	return (
		<div className='pages'>
			<Button fun={() => Create_New_Batch()} title={"Create New Batch"} />
			<table className="table">
				<tr>
					{
						tableHeader.map((th) => {
							return (
								<th>{th}</th>
							)
						})
					}
				</tr>
				{
					batchList
						?
						batchList.map((data) => {
							return (
								<tr>
									<td>{data.batchName}</td>
									<td>{data.courseName}</td>
									<td>{data.studentDataList.length}</td>
									<td>{data.mentorDataList.length}</td>
									<td className='tableBtnArea'>
										<Button fun={() => handleViewBatch(data)} title={"View"} />
										<Button fun={() => handleDeleteBatch(data)} title={"Delete Batch"} />
									</td>
								</tr>
							);
						})
						:
						<h1>No Batch Found</h1>
				}

			</table>
		</div>
	)
}
