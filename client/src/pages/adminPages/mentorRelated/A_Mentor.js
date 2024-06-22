import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addMentorList, deleteMentorList } from '../../../store/slice/MentorSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function A_Mentor() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let batchID = useSelector(state => state.batchData.batchID);
    let batch = useSelector(state => state.batchData.batch);
    let isMentor = useSelector(state => state.mentorData.isMentor);
    let mentorList = useSelector(state => state.mentorData.mentorList);

    const tableHeader = ["Mentor Name", "Mentor Email", "Sbject Name", "Toal Batches", "Action"];

    useEffect(() => {
        if (!isMentor) {
            Handle_Get_All_Mentors();
        } else if (batch && batch.mentorDataList && batch.mentorDataList.length !== 0) {
            Handle_Get_Mentors_All_Data();
        } else {
            dispatch(deleteMentorList());
        }
    }, [isMentor, batch, dispatch]);


    const Handle_Get_All_Mentors = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Admin") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Admin/getAllMentors`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.data.status === true) {
                    dispatch(addMentorList(result.data.mentorData));
                } else {
                    console.log(result.data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };


    const Handle_Get_Mentors_All_Data = async () => {
        try {
            const token = Cookies.get('auth_token');
            const role = Cookies.get('role');

            if (token && role === "Admin") {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Admin/getMentorsAllData`,
                    { mentorDataList: batch.mentorDataList },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (result.data.status === true) {
                    dispatch(addMentorList(result.data.mentorData));
                } else if (result.data.status === false) {
                    alert(result.data.error || "Failed to fetch mentor data.");
                }
            } else {
                alert("Unauthorized access or invalid role.");
            }
        } catch (error) {
            console.error("Error fetching mentor data:", error);
            alert("An error occurred while fetching mentor data.");
        }
    };



    const handleViewMentor = () => {
        dispatch(deleteMentorList());
        navigate('/A_View_Mentors');
    }


    const handleDeleteMentor = async (data) => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        const requestData = {
            batchID: batchID,
            mentorID: data._id
        };

        if (token && role && role === "Admin") {
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_API_URL}/Admin/deleteMentor`,
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (result.data.status === true) {
                    Handle_Get_All_Mentors();
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error.message);
            }
        }
    }


    return (
        <div>
            <div>
                <table className="table">

                    <tr>
                        {
                            tableHeader.map((th, index) => (
                                <th key={index}>{th}</th>
                            ))
                        }
                    </tr>

                    {
                        mentorList && mentorList.length !== 0 ?
                            mentorList.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.name}</td>
                                    <td>{d.email}</td>
                                    <td>{d.subject}</td>
                                    <td>{d.batches.length}</td>
                                    <td className='tableBtnArea'>
                                        {
                                            (batch && batch.mentorDataList && batch.mentorDataList.length !== 0)
                                                ?
                                                <>
                                                    <Button fun={() => handleViewMentor(d)} title={"View"} />
                                                    <Button fun={() => handleDeleteMentor(d)} title={"Delete From batch"} />
                                                </>
                                                :
                                                <Button fun={() => handleViewMentor(d)} title={"View"} />
                                        }
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan="5"><h1>No Mentor Found</h1></td>
                            </tr>
                    }

                </table>
            </div>
        </div>
    )
}