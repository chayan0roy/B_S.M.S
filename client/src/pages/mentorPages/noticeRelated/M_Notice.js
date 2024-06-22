import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addNoticeList, addNotice, deleteNotice } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function M_Notice() {
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
		if (batch && batch.noticeList && batch.noticeList.length !== 0) {
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
	}, []);

	const handleViewNotice = (data) => {
		if (isNotice) {
			dispatch(addNotice(data));
			navigate('/A_View_Notice');
		} else {
			dispatch(addNoticeList(data));
			navigate('/A_Notice_List');
		}

	};


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
						noticeList.map((d, index) => (
							<tr key={index}>
								<td style={cellStyle}>{d.batchName}</td>
								<td style={cellStyle}>{d.noticeList.length}</td>
								<td style={cellStyle}>
									<Button fun={() => handleViewNotice(d)} title={"View Notice"} />
								</td>
							</tr>
						))
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
