import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { addBatchList, addBatchID, deleteBatch, addBatch, deleteNoticeList } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/button/Button.js';



export default function M_Batch() {
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

		if (token && role && role === "Mentor") {
			try {
				const result = await axios.post(
					`${process.env.REACT_APP_API_URL}/Mentor/getAllBatch`,
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


	const handleViewBatch = (data) => {
		dispatch(addBatchID(data.id));
		dispatch(deleteBatch());
		dispatch(deleteNoticeList());
		navigate('/M_View_Batch');
	}


	return (
		<div>
			<div>
				<table className="table">
					<tr>
						{
							tableHeader.map((th) => {
								return (
									<th>{th}</th>
								)
							})
						}</tr>
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
										<td>
											<Button fun={() => handleViewBatch(data)} title={"View"} />
										</td>
									</tr>
								);
							})
							:
							<h1>No Batch Found</h1>
					}

				</table>

			</div>

		</div >
	)
}
