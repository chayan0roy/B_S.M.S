import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

import { useSelector, useDispatch } from 'react-redux';
import { addMentorList, deleteMentorList } from '../../../store/slice/MentorSlice.js';


export default function A_Choose_Mentor() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let batchID = useSelector(state => state.batchData.batchID);
    let mentorList = useSelector(state => state.mentorData.mentorList);


    const tableHeader = ["Mentor Name", "Mentor Email", "Sbject Name", "Toal Batches", "Action"];

    useEffect(() => {
        dispatch(deleteMentorList());
        Handle_Get_All_Mentors_Data();
    }, []);


    const Handle_Get_All_Mentors_Data = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        const formData = new FormData();
        formData.append("batchID", batchID);

        if (token && role && role === "Admin") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Admin/getAllMentorsData`, formData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (result.data.status === true) {
                    dispatch(addMentorList(result.data.mentorData));
                } else {
                    dispatch(deleteMentorList());
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleChooseMentor = async (d) => {
        const data = {
            mentorId: d._id,
            batchID: batchID
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/chooseMentor`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === true) {
                alert("Mentor choosing successful!");
                navigate('/');
            } else {
                alert(response.data.error || "Error occurred while choosing mentor.");
            }
        } catch (error) {
            console.error("Error occurred while choosing mentor:", error);
            alert("An error occurred while choosing mentor.");
        }
    };


    return (
        <div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            {
                                tableHeader.map((th) => {
                                    return (
                                        <th>{th}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            mentorList != null
                                ?
                                mentorList.map((d) => {
                                    return (
                                        <tr>
                                            <td>{d.name}</td>
                                            <td>{d.email}</td>
                                            <td>{d.subject}</td>
                                            <td>{d.batches.length}</td>
                                            <td className='tableBtnArea'>
                                                <Button fun={() => handleChooseMentor(d)} title={"Choose"} />
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <h1>No Mentor available</h1>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
