import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Input from '../../../components/inputField/Input.js'
import Button from '../../../components/button/Button.js';



export default function A_Create_Notice() {
	const navigate = useNavigate();
	let batchID = useSelector(state => state.batchData.batchID);

	const [noticeTitle, setNoticeTitle] = useState('');
	const [noticeBody, setNoticeBody] = useState('');

	const Handle_Add_Notice = async () => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Admin") {
			if (!noticeTitle || !noticeBody) {
				console.log("Please Fill The field");
				return;
			}
			const formData = new FormData();

			formData.append("noticeTitle", noticeTitle);
			formData.append("noticeBody", noticeBody);
			try {
				const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/addNotice/${batchID}`, formData, {
					headers: {
						'Content-Type': 'application/json',
					}
				});

				if (result.data.status === true) {
					alert("Notice Save Successful!!!");
					navigate('/A_Notice');
				}
				else {
					alert(result.data.message)
				}
			} catch (error) {
				alert(error)
			}
		}

	};



	return (
		<div>
			<div className="input-field">
				<i className="fas fa-user"></i>
				<Input className={"input_box"} placeholder={"Enter notice Title"} type={"text"} fun={setNoticeTitle} />
			</div>
			<div className="input-field">
				<i className="fas fa-user"></i>
				<Input className={"input_box"} placeholder={"Enter notice Body"} type={"text"} fun={setNoticeBody} />
			</div>
			<Button fun={Handle_Add_Notice} title={"Add Notice"} />
		</div>
	)
}






