import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSubjectList, deleteSubjectList } from '../../../store/slice/SubjectSlice.js';

export default function M_Subject() {
    const dispatch = useDispatch();

    const batch = useSelector(state => state.batchData.batch);
    const subjectList = useSelector(state => state.subjectData.subjectList);

    const tableHeader = ["Batch Name", "Subject Name"]


    useEffect(() => {
        if (batch && batch.subjectList && batch.subjectList.length !== 0) {
            const arr = [{
                batchName: batch.batchName,
                subjectList: batch.subjectList
            }]
            dispatch(addSubjectList(arr));
        } else {
            dispatch(deleteSubjectList());
        }
    }, []);


    return (
        <div>
            <div>
                <table className="table">

                    <tr>
                        {tableHeader.map((th, index) => (
                            <th key={index}>{th}</th>
                        ))}
                    </tr>

                    {subjectList.length !== 0
                        ?
                        subjectList.map((data) => {
                            return (
                                data.subjectList.map((sd) => {
                                    return (
                                        <tr>
                                            <td>{data.batchName}</td>
                                            <td>{sd}</td>
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

                </table>
            </div>
        </div>
    );
}



