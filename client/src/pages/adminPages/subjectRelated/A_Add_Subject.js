import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Input from '../../../components/inputField/Input'
import Button from '../../../components/button/Button.js';

export default function A_Add_Subject() {
	const navigate = useNavigate();

	const batchID = useSelector(state => state.batchData.batchID);

	const [subjectName, setSubjectName] = useState('')

	const Handle_Add_Subject = async () => {
		if (!subjectName) {
			console.log("Please Fill Fields");
			return;
		}
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');

		if (token && role && role === "Admin") {
			const formData = new FormData();

			formData.append("batchID", batchID);
			formData.append("subjectName", subjectName);
			try {
				const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/addSubject`, formData, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (result.data.status === true) {
					alert("Subject Add Successful!!!");
					navigate('/A_Subject');
				}
				else {
					alert(result.data.message)
				}
			} catch (error) {
				alert(error)
			}
		}
	}


	return (
		<div>
			<div className="input-field">
				<i className="fas fa-user"></i>
				<Input className={"input_box"} placeholder={"Enter Subject Name"} type={"text"} fun={setSubjectName} />
			</div>
			<Button fun={Handle_Add_Subject} title={"Add Subject"} />
		</div>
	)
}
