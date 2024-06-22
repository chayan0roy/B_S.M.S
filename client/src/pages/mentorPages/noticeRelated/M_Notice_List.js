import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotice } from '../../../store/slice/BatchSlice.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function M_Notice_List() {
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
        console.log(data);
        dispatch(addNotice(data));
        navigate('/A_View_Notice');
    };

    const handleDeleteNotice = async (data) => {
        console.log(data);
        // const token = Cookies.get('auth_token');
        // const role = Cookies.get('role');

        // if (token && role && role === "Admin") {
        //     try {
        //         const result = await axios.delete(
        //             `${process.env.REACT_APP_API_URL}/Admin/deleteNotice/${data.id}`,
        //             {
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     Authorization: `Bearer ${token}`
        //                 }
        //             }
        //         );

        //         if (result.data.status === true) {
        //         } else {
        //             alert(result.data.message);
        //         }
        //     } catch (error) {
        //         alert(error.message);
        //     }
        // }
    };
    console.log(noticeList);

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
                                                <Button fun={() => handleDeleteNotice(data)} title={"Delete Notice"} />
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
