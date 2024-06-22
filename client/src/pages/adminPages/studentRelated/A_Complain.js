import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';
import { complainData } from '../../../DummyData.js'

export default function A_Complain() {
	const navigate = useNavigate()
	const tableHeader = ["Student Name", "Student Email", "Batch Name", "Subject Name", "Action"];

	const tableStyle = {
		borderCollapse: 'collapse',
		width: '100%',
		// border: '1px solid black',
	};
	const tableHead = {
		backgroundColor: 'black',
		color: 'white'
	};
	const cellStyle = {
		// border: '1px solid black',
		padding: '25px',
		textAlign: 'center',
	};


	const [complainList, setComplainList] = useState('f');

	const handleViewComplain = (d) => {
		navigate('/A_View_Complain');
	}
	const handleDeleteComplain = (d) => {
		console.log(`Complain ${d.title} has deleted`);
	}


	return (
		<div>
			{
				complainList
					?
					<div>
						<table className="table">
							<thead style={tableHead}>
								<tr>
									{
										tableHeader.map((th) => {
											return (
												<th style={cellStyle}>{th}</th>
											)
										})
									}
								</tr>
							</thead>
							<tbody>
								{
									complainData != null
										?
										complainData.map((d) => {
											return (
												<tr>
													<td style={cellStyle}>{d.studentName}</td>
													<td style={cellStyle}>{d.studentemail}</td>
													<td style={cellStyle}>{d.batchName}</td>
													<td style={cellStyle}>{d.subjectName}</td>
													<td style={cellStyle}>
														<Button fun={() => handleViewComplain(d)} title={"View Complain"} />
														<Button fun={() => handleDeleteComplain(d)} title={"Delete Complain"} />
													</td>
												</tr>
											);
										})
										:
										<></>
								}
							</tbody>
						</table>
					</div>
					:
					<div>
						<h1>No Complain Found</h1>
					</div>
			}
		</div>
	)
}
