import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addBatch } from '../../../store/slice/BatchSlice';
import { Link } from 'react-router-dom';


export default function A_View_Batch() {
    const dispatch = useDispatch();

    const batchId = useSelector(state => state.batchData.batchID);
    const batch = useSelector(state => state.batchData.batch);


    useEffect(() => {
        handleGetBatchAllData();
    }, []);

    const handleGetBatchAllData = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Admin") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Admin/getBatchAllData/${batchId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (result.data.status === true) {
                    dispatch(addBatch(result.data.batchData));
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    // if (batchData) {
    //     const classStartDate = new Date(batchData.classStartDate);
    //     const currentDate = new Date();
    //     currentDate.setUTCHours(0, 0, 0, 0);
    //     const timeDifference = classStartDate - currentDate;
    //     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    //     console.log(days);
    // }

    return (
        <div>
            {
                batch ?
                    <div>
                        <h1>batchName :  {batch.batchName}</h1>
                        <h1>courseName :  {batch.courseName}</h1>
                        <h1>admissionFees : {batch.admissionFees}</h1>
                        <h1>monthlyFees : {batch.monthlyFees}</h1>
                        <h1>session : {batch.session}</h1>
                    </div>
                    :
                    <></>
            }

            <div className='A_View_BatchLinkBox'>
                <Link className='link A_View_BatchLink' to={`/A_Subject`}>View All Subject</Link>
                <Link className='link A_View_BatchLink' to='/A_Add_Subject'>Add Subject</Link>
            </div>
            <div className='A_View_BatchLinkBox'>
                <Link className='link A_View_BatchLink' to={`/A_Mentor`}>View All Mentor</Link>
                <Link className='link A_View_BatchLink' to='/A_Choose_Mentor'>Add Mentor</Link>
            </div>
            <div className='A_View_BatchLinkBox'>
                <Link className='link A_View_BatchLink' to={`/A_Student`}>View All Students</Link>
                <Link className='link A_View_BatchLink' to='/A_Add_Student'>Add Student</Link>
            </div>
            <div className='A_View_BatchLinkBox'>
                <Link className='link A_View_BatchLink' to={`/A_Notice`}>View All Notice</Link>
                <Link className='link A_View_BatchLink' to='/A_Create_Notice'>Add Notice</Link>
            </div>
            <div className='A_View_BatchLinkBox'>
                <Link className='link A_View_BatchLink' to={`/A_View_Complain`}>View All Complain</Link>
            </div>
        </div>
    )

}
