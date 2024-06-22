import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';
import { useSelector, useDispatch } from 'react-redux';
import { addStudentList, deleteStudentList } from '../../../store/slice/StdentSlice.js';


export default function M_Add_Student() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let batchID = useSelector(state => state.batchData.batchID);
    let batch = useSelector(state => state.batchData.batch);
    let studentList = useSelector(state => state.studentData.studentList);

    const tableHeader = ["Student Name", "Student Email", "Sbject Name", "Batch Name", "Action"];



    useEffect(() => {
        dispatch(deleteStudentList());
        Handle_Get_All_Student_Data();
    }, []);


    const Handle_Get_All_Student_Data = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Mentor") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Mentor/getAllStudentsData`,
                    { batchName: batch.batchName },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (result.data.status === true) {
                    console.log(result.data.studentData);
                    dispatch(addStudentList(result.data.studentData));
                } else {
                    dispatch(deleteStudentList());
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleApproveStudent = async (data) => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Mentor") {
            try {
                const formData = new FormData();
                formData.append("studentID", data._id);
                formData.append("batchID", batchID);

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/Mentor/approveStudent`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.status === true) {
                    Handle_Get_All_Student_Data();
                } else {
                    alert(response.data.error || "Error occurred while choosing Student.");
                }
            } catch (error) {
                console.error("Error occurred while choosing Student:", error);
                alert("An error occurred while choosing Student.");
            }
        }
    };


    return (
        <div>
            <div>
                <table className="table">

                    <tr>
                        {
                            tableHeader.map((th) => {
                                return (
                                    <th>{th}</th>
                                )
                            })
                        }
                    </tr>

                    {
                        studentList != null
                            ?
                            studentList.map((data) => {
                                return (
                                    <tr>
                                        <td>{data.name}</td>
                                        <td>{data.email}</td>
                                        <td>{data.subject}</td>
                                        <td>{data.batches.length}</td>
                                        <td>
                                            <Button fun={() => handleApproveStudent(data)} title={"Choose"} />
                                        </td>
                                    </tr>
                                );
                            })
                            :
                            <h1>No Student available</h1>
                    }

                </table>
            </div>
        </div>
    )
}
