import React, { useState, useEffect } from 'react'
import Button from '../../../components/button/Button.js';
import { paymentHistory } from '../../../DummyData.js'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';



export default function A_Payment_History() {

    let student = useSelector(state => state.studentData.student);

    const [paymentData, setPaymentdata] = useState('')

    useEffect(() => {
        handleViewPayment();
    }, []);

    const handleViewPayment = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === 'Admin') {
            const formData = new FormData();
            formData.append('batchID', student.batchID);
            formData.append('studentID', student.d._id);

            try {
                const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/viewPayment`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (result.data.status === true) {
                    setPaymentdata(result.data.paymentData);
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    };


    const handleApprove = async (d) => {
        console.log(d);
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === 'Admin') {
            const formData = new FormData();
            formData.append('batchID', student.batchID);
            formData.append('studentID', student.d._id);
            formData.append('paymentID', d);

            try {
                const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/approvePayment`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (result.data.status === true) {
                    handleViewPayment();
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    }

    const handleReject = async (d) => {
        console.log(d);
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === 'Admin') {
            const formData = new FormData();
            formData.append('batchID', student.batchID);
            formData.append('studentID', student.d._id);
            formData.append('paymentID', d);

            try {
                const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/rejectPayment`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (result.data.status === true) {
                    handleViewPayment();
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    }

    return (
        <div>
            {
                paymentData
                    ?
                    paymentData.map((data) => {
                        return (
                            <div className='card'>
                                <img src={`${process.env.REACT_APP_API_URL}/uploads/${data.screenshort}`} alt="course image" />
                                <div>
                                    <h2>{data.amount}</h2>
                                </div>
                                {
                                    !data.isApprove ?
                                        <>
                                            <Button fun={() => handleApprove(data._id)} title={"Approve"} />
                                            <Button fun={() => handleReject(data._id)} title={"Reject"} />
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        );
                    })
                    :
                    <></>
            }
        </div>
    )
}
