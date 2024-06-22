import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { addBatchList, addBatch } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/button/Button.js';


export default function S_Batch() {

	const dispatch = useDispatch();
	const navigate = useNavigate()

	let batchList = useSelector(state => state.batchData.batchList);

	useEffect(() => {
		Handle_Get_All_Registered_Batch();
	}, []);

	const Handle_Get_All_Registered_Batch = async () => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Student") {
			try {
				const result = await axios.post(
					`${process.env.REACT_APP_API_URL}/Student/getAllRegisteredBatch`,
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
		dispatch(addBatch(data));
		navigate('/S_View_Batch');
	}

	return (
		<div>
			{
				batchList ?
					batchList.map((data) => {
						return (
							<div className='card'>
								<img src='' alt='course image'></img>
								<div>
									<h2>{data.batchName}</h2>
									<div>
										<img src='' alt='mentor image'></img>
										<img src='' alt='mentor image'></img>
									</div>
									<Button fun={() => handleViewBatch(data)} title={"View"} />
								</div>
							</div>
						);
					})
					:
					<></>
			}

		</div>
	)
}
