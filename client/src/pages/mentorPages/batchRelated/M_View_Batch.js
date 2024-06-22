import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addBatch } from '../../../store/slice/BatchSlice';
import { Link } from 'react-router-dom';


export default function M_View_Batch() {
    const dispatch = useDispatch();

    const batchId = useSelector(state => state.batchData.batchID);
    const batch = useSelector(state => state.batchData.batch);


    useEffect(() => {
        handleGetBatchAllData();
    }, []);

    const handleGetBatchAllData = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Mentor") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Mentor/getBatchAllData/${batchId}`,
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

            <div>
                <Link to={`/M_Subject`}>View All Subject</Link>
            </div>
            <div>
                <Link to={`/M_Student`}>View All Students</Link>
                <Link to='/M_Add_Student'>Add Student</Link>
            </div>
            <div>
                <Link to={`/M_Notice`}>View All Notice</Link>
            </div>
        </div>
    )

}
