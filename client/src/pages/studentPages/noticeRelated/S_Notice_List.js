import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { addNotice } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function S_Notice_List() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const noticeList = useSelector(state => state.batchData.noticeList);

    const tableHeader = ["Notice Title", "Batch Name", "Action"];

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
    };

    const tableHead = {
        backgroundColor: 'black',
        color: 'white'
    };

    const cellStyle = {
        padding: '25px',
        textAlign: 'center',
    };

    const handleViewNotice = (data) => {
        dispatch(addNotice(data));
        navigate('/S_View_Notice');
    };


    return (
        <div>
            <div>
                <table className="table">
                    <thead style={tableHead}>
                        <tr>
                            {tableHeader.map((th, index) => (
                                <th key={index} style={cellStyle}>{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            noticeList && noticeList.noticeList.length !== 0
                                ?
                                noticeList.noticeList.map((data) => {
                                    return (
                                        <tr>
                                            <td style={cellStyle}>{data.noticeTitle}</td>
                                            <td style={cellStyle}>{noticeList.batchName}</td>
                                            <td style={cellStyle}>
                                                <Button fun={() => handleViewNotice(
                                                    {
                                                        batchName: noticeList.batchName,
                                                        data: data
                                                    }
                                                )} title={"View Notice"} />
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={tableHeader.length} style={cellStyle}>No Notice Found</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
