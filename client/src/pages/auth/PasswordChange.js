import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slice/AuthSlice';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


import CustomInput from '../../components/CustomInput/CustomInput'
import CustomButton1 from '../../components/CustomButton/CustomButton1'

export default function PasswordChange() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id, token } = useParams();

    const [newPassword, setNewPassword] = useState();
    const [confromPassword, setConfromPassword] = useState();

    const setPassword = async () => {
        try {
            const result = await axios.post(`http://localhost:5000/Student/userPasswordReset/${id}/${token}`, { newPassword, confromPassword }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status === true) {
                setTimeout(() => {
                    toast.success("Password Change successfully");
                    Cookies.remove('auth_token');
                    dispatch(logout());
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
            <CustomInput type={"password"} placeholder={"Enter New Password"} fun={setNewPassword} />
            <CustomInput type={"password"} placeholder={"Enter Confrom Password"} fun={setConfromPassword} />
            <CustomButton1 title={"Submit"} fun={setPassword} padding={"12px 25px"} />
        </div>
    )
}
