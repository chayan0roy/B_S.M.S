import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';


export default function S_ViewPayment() {

    const batch = useSelector(state => state.batchData.batch);

    const [paymentData, setPaymentdata] = useState('')

    useEffect(() => {
        handleViewPayment();
    }, []);

    const handleViewPayment = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === 'Student') {
            const formData = new FormData();
            formData.append('batchID', batch._id);

            try {
                const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/viewPayment`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
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
                            </div>
                        );
                    })
                    :
                    <></>
            }
        </div>
    )
}
