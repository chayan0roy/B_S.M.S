import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addNoticeList, addNotice, deleteNotice } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function A_Notice() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const batch = useSelector(state => state.batchData.batch);
	const isNotice = useSelector(state => state.batchData.isNotice);
	const noticeList = useSelector(state => state.batchData.noticeList);

	const tableHeader = ["Batch Name", `${isNotice ? "Notice Title" : "Notice Item"}`, "View"];
	const tableStyle = {
		borderCollapse: 'collapse',
		width: '100%',
	};

	const tableHead = {
		backgroundColor: 'black',
		color: 'white'
	};

	const cellStyle = {
		padding: '25px',
		textAlign: 'center',
	};

	useEffect(() => {
		if (!isNotice) {
			Handle_Get_All_Notice();
		} else if (batch && batch.noticeList && batch.noticeList.length !== 0) {
			const arr = [
				{
					batchName: batch.batchName,
					noticeList: batch.noticeList
				}
			]
			dispatch(addNoticeList(arr));
		} else {
			dispatch(deleteNotice());
		}
	}, [isNotice, batch, dispatch]);

	const Handle_Get_All_Notice = async () => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Admin") {
			try {
				const result = await axios.get(`${process.env.REACT_APP_API_URL}/Admin/getAllNotice`, {
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (result.data.status === true) {
					dispatch(addNoticeList(result.data.noticeData));
				} else {
					console.log(result.data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		}
	};


	const handleViewNotice = (data) => {
		if (isNotice) {
			dispatch(addNotice(data));
			navigate('/A_View_Notice');
		} else {
			dispatch(addNoticeList(data));
			navigate('/A_Notice_List');
		}

	};


	// const handleDeleteNotice = async (data) => {
	// 	const token = Cookies.get('auth_token');
	// 	const role = Cookies.get('role');

	// 	if (token && role && role === "Admin") {
	// 		try {
	// 			const result = await axios.delete(
	// 				`${process.env.REACT_APP_API_URL}/Admin/deleteNotice/${data.id}`,
	// 				{
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 						Authorization: `Bearer ${token}`
	// 					}
	// 				}
	// 			);

	// 			if (result.data.status === true) {
	// 				Handle_Get_All_Notice();
	// 			} else {
	// 				alert(result.data.message);
	// 			}
	// 		} catch (error) {
	// 			alert(error.message);
	// 		}
	// 	}
	// };

	return (
		<div>
			<div>
				<table className="table">
					<tr>
						{tableHeader.map((th, index) => (
							<th key={index} style={cellStyle}>{th}</th>
						))}
					</tr>

					{noticeList !== null && noticeList.length > 0 ? (
						isNotice ? (
							noticeList[0].noticeList.map((d, index) => (
								<tr key={index}>
									<td style={cellStyle}>{noticeList[0].batchName}</td>
									<td style={cellStyle}>{d.noticeTitle}</td>
									<td style={cellStyle}>
										<Button fun={() => handleViewNotice(
											{
												batchName: noticeList[0].batchName,
												data: d
											}
										)} title={"View Notice"} />
									</td>
								</tr>
							))
						) : (
							noticeList.map((d, index) => (
								<tr key={index}>
									<td style={cellStyle}>{d.batchName}</td>
									<td style={cellStyle}>{d.noticeList.length}</td>
									<td style={cellStyle}>
										<Button fun={() => handleViewNotice(d)} title={"View Notice"} />
									</td>
								</tr>
							))
						)
					) : (
						<tr>
							<td colSpan={tableHeader.length} style={cellStyle}>No Notice Found</td>
						</tr>
					)}

				</table>
			</div>
		</div >
	);

}
