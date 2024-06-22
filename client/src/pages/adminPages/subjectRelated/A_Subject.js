import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addSubjectList, deleteSubjectList } from '../../../store/slice/SubjectSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function A_Subject() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const batch = useSelector(state => state.batchData.batch);
    const isSubject = useSelector(state => state.subjectData.isSubject);
    const subjectList = useSelector(state => state.subjectData.subjectList);

    const tableHeader = ["Batch Name", "Subject Name", "Action"]



    useEffect(() => {
        if (!isSubject) {
            Handle_Get_All_Subject();
        } else if (batch && batch.subjectList && batch.subjectList.length !== 0) {
            const arr = [{
                batchName: batch.batchName,
                subjectList: batch.subjectList
            }]
            dispatch(addSubjectList(arr));
        } else {
            dispatch(deleteSubjectList());
        }
    }, [isSubject, batch, dispatch]);


    const Handle_Get_All_Subject = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === "Admin") {
            try {
                const result = await axios.get(`${process.env.REACT_APP_API_URL}/Admin/getAllSubject`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (result.data.status === true) {
                    dispatch(addSubjectList(result.data.subjectData));
                } else {
                    console.log(result.data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };


    const handleViewSubject = () => {
        navigate('/A_View_Subject')
    }


    const handleDeleteSubject = async (batchName, sd) => {

        const formData = new FormData();
        formData.append("batchName", batchName);
        formData.append("subject", sd);

        try {
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/deleteSubject`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status === true) {
                alert("Delete Successful!!!");
                navigate('/');
            }
            else {
                alert(result.data.message)
            }
        } catch (error) {
            alert(error)
        }
    };



    return (
        <div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            {tableHeader.map((th, index) => (
                                <th key={index}>{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {subjectList.length !== 0
                            ?
                            subjectList.map((data) => {
                                return (
                                    data.subjectList.map((sd) => {
                                        return (
                                            <tr>
                                                <td>{data.batchName}</td>
                                                <td>{sd}</td>
                                                <td className='tableBtnArea'>
                                                    {
                                                        (batch && batch.subjectList && batch.subjectList.length !== 0)
                                                            ?
                                                            <>
                                                                <Button fun={() => handleViewSubject()} title={"View Subject"} />
                                                                <Button fun={() => handleDeleteSubject(data.batchName, sd)} title={"Delete Subject"} />
                                                            </>
                                                            :
                                                            <Button fun={() => handleViewSubject()} title={"View Subject"} />
                                                    }

                                                </td>
                                            </tr>
                                        )
                                    })
                                )
                            })
                            :
                            <tr>
                                <td colSpan={tableHeader.length}>No Subject Found</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}



