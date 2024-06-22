import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import addPhoto from '../../../assets/addPhoto.png';

export default function S_FeesPayment() {

    const batch = useSelector(state => state.batchData.batch);

    const [viewImage, setViewImage] = useState(addPhoto);
    const [image, setImage] = useState('');
    const [amount, setAmount] = useState('');

    const convertUserIMG = (e) => {
        setImage(e.target.files[0]);
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setViewImage(fileReader.result);
        };
    };

    const SubmitPayment = async () => {
        const token = Cookies.get('auth_token');
        const role = Cookies.get('role');

        if (token && role && role === 'Student') {
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('image', image);
            formData.append('batchID', batch._id);

            try {
                const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/submitPayment`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                setImage('');
                setAmount('');
                setViewImage(addPhoto);

                if (result.data.status === true) {
                    alert('Image Upload Successful!!!');
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <div>
            <img src={viewImage} alt="Uploaded" />
            <input type="file" className="image_input" required onChange={convertUserIMG} />
            <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={SubmitPayment}>Submit</button>
        </div>
    );
}
