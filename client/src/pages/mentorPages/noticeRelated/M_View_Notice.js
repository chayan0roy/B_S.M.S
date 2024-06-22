import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button.js';

export default function M_View_Notice() {
    const token = Cookies.get('auth_token');
    const role = Cookies.get('role');

    const navigate = useNavigate();

    const notice = useSelector(state => state.batchData.notice);

    const [noticeTitle, setNoticeTitle] = React.useState(notice.data.noticeTitle)
    const [noticeBody, setNoticeBody] = React.useState(notice.data.noticeBody)

    const submitUpdateNotice = async () => {
        if (!noticeTitle || !noticeBody) {
            console.log("Please Fill Fields");
            return;
        }

        const formData = new FormData();

        formData.append("batchName", notice.batchName);
        formData.append("noticeID", notice.data._id);
        formData.append("noticeTitle", noticeTitle);
        formData.append("noticeBody", noticeBody);

        try {
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/Admin/updateNotice`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status === true) {
                alert("Update Successful!!!");
                navigate('/');
            }
            else {
                alert(result.data.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            {
                token && role && role === "Admin" ?
                    <div>
                        <input type='text' value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)}></input>
                        <input type='text' value={noticeBody} onChange={(e) => setNoticeBody(e.target.value)}></input>
                        <Button fun={submitUpdateNotice} title={"Update"} />
                    </div>
                    :
                    <div>
                        <div>{notice.data.noticeTitle}</div>
                        <div>{notice.data.noticeBody}</div>
                    </div>
            }
        </div>
    )
}
