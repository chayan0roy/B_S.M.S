import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../store/slice/AuthSlice';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton1 from '../../components/CustomButton/CustomButton1';


export default function ApproveByOTP() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const submitOTP = async () => {
        if (!email || !otp) {
            toast.error("Please enter email and OTP");
            return;
        }

        try {
            const result = await axios.post(`http://localhost:5000/Student/verifyEmail`, { email, otp }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status === true) {
                toast.success("Email verified successfully");
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
        <div className='ApproveByOTP'>
            <ToastContainer />
            <CustomInput type="email" placeholder="Enter your email" fun={setEmail} />
            <CustomInput type="number" placeholder="Enter OTP" fun={setOtp} />
            <CustomButton1 title="Submit" fun={submitOTP} padding="12px 25px" />
        </div>
    )
}
