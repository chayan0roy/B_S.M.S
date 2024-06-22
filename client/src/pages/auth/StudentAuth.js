import './Auth.css';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slice/AuthSlice';
import { useNavigate } from 'react-router-dom';
import addPhoto from '../../assets/accont.png';

import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton1 from '../../components/CustomButton/CustomButton1';
import CustomButton2 from '../../components/CustomButton/CustomButton2';


export default function StudentAuth() {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [containerCls, setContainerCls] = useState(false);
	const [viewImage, setViewImage] = useState(addPhoto);
	const [image, setImage] = useState('');
	const [name, setName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [address, setAddress] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const role = "Student";

	const convertUserIMG = (e) => {
		setImage(e.target.files[0]);
		var fileReader = new FileReader();
		fileReader.readAsDataURL(e.target.files[0]);
		fileReader.onload = () => {
			setViewImage(fileReader.result);
		};
	};


	const activeSignUp = () => {
		setContainerCls(true);
	};

	const activeSignIn = () => {
		setContainerCls(false);
	};

	const submitStudentRegister = async () => {
		if (!name || !mobileNumber || !whatsappNumber || !address || !email || !password) {
			console.log("Please Fill all fields");
			return;
		}
		const formData = new FormData();

		formData.append('image', image);
		formData.append("name", name);
		formData.append("mobileNumber", mobileNumber);
		formData.append("whatsappNumber", whatsappNumber);
		formData.append("address", address);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("role", role);

		try {
			const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/register`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			if (result.data.status === true) {
				setTimeout(() => {
					navigate('/ApproveByOTP');
				}, 2000);
			} else {
				toast.error(result.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	}

	const submitStudentLogin = async () => {
		if (!email || !password) {
			console.log("Please Enter email and password");
			return;
		}
		const formData = new FormData();

		formData.append("email", email);
		formData.append("password", password);
		try {
			const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/login`, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (result.data.status === true) {
				setTimeout(() => {
					Cookies.set('auth_token', result.data.auth_token, { expires: 7 });
					Cookies.set('role', result.data.role, { expires: 7 });
					dispatch(login(result.data.role));
					navigate('/');
				}, 2000);
			} else {
				toast.error(result.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}

	}


	return (
		<div className='AuthPage'>
			<ToastContainer />
			<div className={containerCls ? "authContainer right-panel-active" : "authContainer"} id="container">
				<div className="form-container sign-up-container">
					<div className='form'>
					<h1>Student Register</h1>
						<div className="image-input-field">
							<input className='input-image' type="file" onChange={convertUserIMG} />
							<img className='input-field-image' src={viewImage} alt="Uploaded" />
						</div>
						<CustomInput type="text" placeholder="Enter your name" fun={setName} />
						<CustomInput type="number" placeholder="Enter mobile number" fun={setMobileNumber} />
						<CustomInput type="number" placeholder="Enter Whatsapp number" fun={setWhatsappNumber} />
						<CustomInput type="text" placeholder="Enter address" fun={setAddress} />
						<CustomInput type="email" placeholder="Enter your email" fun={setEmail} />
						<CustomInput type="password" placeholder="Enter your password" fun={setPassword} />
						<CustomButton1 title="Sign Up" fun={submitStudentRegister} padding="12px 35px" />
					</div>
				</div>
				<div className="form-container sign-in-container">
					<div className='form'>
					<h1>Student Login</h1>
						<CustomInput type="email" placeholder="Enter your email" fun={setEmail} />
						<CustomInput type="password" placeholder="Enter your password" fun={setPassword} />
						<a href="/PasswordResetLink">Forgot your password?</a>
						<CustomButton1 title="Sign In" fun={submitStudentLogin} padding="12px 35px" />
					</div>
				</div>
				<div className="overlay-container">
					<div className="overlay">
						<div className="overlay-panel overlay-left">
							<h1>Welcome Back!</h1>
							<p>To keep connected with us please login with your personal info</p>
							<CustomButton2 title="Go Sign In" fun={activeSignIn} padding="12px 25px" />
						</div>
						<div className="overlay-panel overlay-right">
							<h1>Hello, Friend!</h1>
							<p>Enter your personal details and start journey with us</p>
							<CustomButton2 title="Go Sign Up" fun={activeSignUp} padding="12px 25px" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}