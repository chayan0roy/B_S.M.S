import React from 'react'
import Button from '../../../components/button/Button.js';
import { useNavigate } from 'react-router-dom';

export default function M_View_Student() {
    const navigate = useNavigate()
    const handleViewPayment = () => {
        navigate('/M_Payment_History');
    }
    return (
        <div>
            <Button fun={() => handleViewPayment()} title={"View"} />
        </div>
    )
}
