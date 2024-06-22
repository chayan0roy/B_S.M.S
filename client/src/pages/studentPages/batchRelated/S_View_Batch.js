import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addBatchData } from '../../../store/slice/BatchSlice';
import { Link } from 'react-router-dom';


export default function S_View_Batch() {
    const dispatch = useDispatch();


    const batch = useSelector(state => state.batchData.batch);

    // useEffect(() => {
    //     handleGetBatchAllData();
    // }, []);

    // const handleGetBatchAllData = async () => {
    //     const token = Cookies.get('auth_token');
    //     const role = Cookies.get('role');

    //     if (token && role && role === "Admin") {
    //         try {
    //             const result = await axios.post(
    //                 `${process.env.REACT_APP_API_URL}/Admin/getBatchAllData/${batchId}`,
    //                 {
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 }
    //             );
    //             if (result.data.status === true) {
    //                 dispatch(addBatch(result.data.batchData));
    //             } else {
    //                 alert(result.data.message);
    //             }
    //         } catch (error) {
    //             alert(error.message);
    //         }
    //     }
    // };


    return (
        <div>
            <h1>Batch Data</h1>
            {
                batch ?
                    <div>
                        <h1>batchName :  {batch.batchName}</h1>
                        <h1>courseName :  {batch.courseName}</h1>
                        <h1>subject : {batch.subjectList && batch.subjectList.map((s) => {
                            return (<span>{s}</span>);
                        })}</h1>
                        <h1>admissionFees : {batch.admissionFees}</h1>
                        <h1>monthlyFees : {batch.monthlyFees}</h1>
                        <h1>session : {batch.session}</h1>
                    </div>
                    :
                    <></>
            }

            <div>
                <Link to={`/S_FeesPayment`}>Fees Payment</Link>
                <Link to={`/S_ViewPayment`}>View Payment</Link>
            </div>
            <div>
                <Link to={`/S_Home_Work`}>Home Work</Link>
            </div>
            <div>
                <Link to={`/S_Notice_List`}>All Notice</Link>
            </div>
        </div>
    )

}
