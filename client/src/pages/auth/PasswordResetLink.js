import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CustomInput from '../../components/CustomInput/CustomInput'
import CustomButton1 from '../../components/CustomButton/CustomButton1'


export default function PasswordResetLink() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState();


    const sendEmail = async () => {
        if (!email) {
            toast.error("Please enter email");
            return;
        }

        try {
            const result = await axios.post(`http://localhost:5000/Student/sendUserPasswordResetEmail`, { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status === true) {
                setTimeout(() => {
                    toast.success("Email Send successfully");
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
        <div className='pt-20'>
            <ToastContainer />
            <CustomInput type={"email"} placeholder={"Enter your email"} fun={setEmail} />
            <CustomButton1 title={"Submit"} fun={sendEmail} padding={"12px 25px"} />
        </div>
    )
}
