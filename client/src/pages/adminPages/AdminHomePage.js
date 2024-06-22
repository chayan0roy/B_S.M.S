import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button.js';
import { adminHomeCardData, noticeData } from '../../DummyData.js'

export default function AdminHomePage() {
	const navigate = useNavigate()
	const tableHeader = ["Title", "Details", "Date", "Action"];

	const handleViewNotice = (d) => {
		console.log(d);
		// navigate('/A_View_Notice');
	}
	const handleDeleteNotice = (d) => {
		console.log(`Notice ${d.title} has deleted`);
	}

	return (
		<div className='AdminHomePage'>
			<div className='AdminHomePageTop'>
				{
					adminHomeCardData.map((d) => {
						return (
							<div className='AdminHomePageTopCard'>
								<img src={d.img} />
								<h2>{d.title}</h2>
								<h3>{d.count}</h3>
							</div>
						);
					})
				}
			</div>
			<div className='AdminHomePageBottom'>
				<h1 className='AdminHomePageBottomNotice'>Notice : </h1>
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
						noticeData != null
							?
							noticeData.map((d) => {
								return (
									<tr>
										<td>{d.title}</td>
										<td>{d.details}</td>
										<td>{d.date}</td>
										<td className='tableBtnArea'>
											<Button fun={() => handleViewNotice(d)} title={"View Notice"} />
											<Button fun={() => handleDeleteNotice(d)} title={"Delete Notice"} />
										</td>
									</tr>
								);
							})
							:
							<></>
					}

				</table>
			</div>
		</div>
	)
}
