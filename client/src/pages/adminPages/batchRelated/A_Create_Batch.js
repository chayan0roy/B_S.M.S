import React, { useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import addPhoto from '../../../assets/image.png';
import Input from '../../../components/inputField/Input'
import Button from '../../../components/button/Button.js';

export default function A_Create_Batch() {
    const navigate = useNavigate()

    const [viewImage, setViewImage] = useState(addPhoto);
    const [image, setImage] = useState('');
    const [batchName, setBatchName] = useState('')
    const [courseName, setCourseName] = useState('')
    const [subject, setSubject] = useState('')
    const [admissionFees, setAdmissionFees] = useState('')
    const [monthlyFees, setMonthlyFees] = useState('')
    const [totalFees, setTotalFees] = useState('')
    const [classStartDate, setClassStartDate] = useState('')
    const [session, setSession] = useState();
    const [studentIdCounter, setStudentIdCounter] = useState();
    const [classTime, setClassTime] = useState();


    const convertUserIMG = (e) => {
        setImage(e.target.files[0]);
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setViewImage(fileReader.result);
        };
    };


    const Handle_Create_Batch = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');
        if (!token || !role) {
            return;
        }
        if (role !== "Admin") {
            return;
        }
        if (!batchName || !courseName || !subject || !admissionFees || !monthlyFees || !totalFees || !classStartDate || !session || !studentIdCounter || !classTime) {
            console.log("Please Fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("batchName", batchName);
        formData.append("courseName", courseName);
        formData.append("subject", subject);
        formData.append("admissionFees", admissionFees);
        formData.append("monthlyFees", monthlyFees);
        formData.append("totalFees", totalFees);
        formData.append("classStartDate", classStartDate);
        formData.append("session", session);
        formData.append("studentIdCounter", studentIdCounter);
        formData.append("classTime", classTime);

        try {
            const result = await axios.post(
                `${process.env.REACT_APP_API_URL}/Admin/createBatch`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.data.status === true) {
                console.log(result.data);
                alert("Batch Created Successful!!!");
                navigate('/A_Batch');
            } else {
                alert(result.data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className='A_Create_Batch'>
            <div className='A_Create_BatchTop'>
                <div className='A_Create_BatchLeft'>
                    <div className="imageinputfield">
                        <input className='imageinput' type="file" onChange={convertUserIMG} />
                        <img className='inputfieldimage' src={viewImage} alt="Uploaded" />
                    </div>
                </div>
                <div className='A_Create_BatchRight'>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Batch Name"} type={"text"} fun={setBatchName} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Course Name"} type={"text"} fun={setCourseName} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Subject Name"} type={"text"} fun={setSubject} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Admission Fees"} type={"number"} fun={setAdmissionFees} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Cource Fees"} type={"number"} fun={setMonthlyFees} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Total Fees"} type={"number"} fun={setTotalFees} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Class Start Date"} type={"date"} fun={setClassStartDate} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Class Session"} type={"text"} fun={setSession} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Student Id Counter"} type={"number"} fun={setStudentIdCounter} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <Input className={"input_box"} placeholder={"Enter Class Time"} type={"text"} fun={setClassTime} />
                    </div>
                </div>
            </div>
            <div className='A_Create_BatchBottom'>
                <Button fun={Handle_Create_Batch} title={"Create Batch"} />
            </div>
        </div>
    )
}
