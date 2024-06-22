import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardTrue, dashboardFalse } from '../../store/slice/DashBoardSlice';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

export default function Navbar() {
    const dispatch = useDispatch();
    const whoIsLogin = useSelector((state) => state.auth.user);

    const [nav, setNav] = useState(false);
    const [loginDropdown, setLoginDropdown] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    const toggleLoginDropdown = () => {
        setLoginDropdown(!loginDropdown);
    };

    const renderDashboardLink = () => {
        if (whoIsLogin === 'Admin') {
            return <Link onClick={() => dispatch(dashboardTrue())} to={'/AdminDashboard'}>Dashboard</Link>;
        } else if (whoIsLogin === 'Mentor') {
            return <Link onClick={() => dispatch(dashboardTrue())} to={'/MentorDashboard'}>Dashboard</Link>;
        } else if (whoIsLogin === 'Student') {
            return <Link onClick={() => dispatch(dashboardTrue())} to={'/StudentDashboard'}>Dashboard</Link>;
        }
        return null;
    };

    return (
        <div className='bg-black fixed flex justify-between items-center h-20 w-full z-50 mx-auto px-4 text-white'>
            <h1 className='w-full text-3xl font-bold text-[#00df9a]'>BSMS.</h1>
            {
                whoIsLogin ?
                    <>
                        <ul className='hidden md:flex'>
                            <li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
                                <Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
                            </li>
                            <li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
                                {renderDashboardLink()}
                            </li>
                        </ul>

                        <div onClick={handleNav} className='block md:hidden'>
                            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                        </div>

                        <ul
                            className={
                                nav
                                    ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
                                    : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                            }
                        >
                            <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>BSMS.</h1>
                            <li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
                                <Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
                            </li>
                            <li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
                                {renderDashboardLink()}
                            </li>
                        </ul>
                    </>
                    :
                    <>
                        <ul className='hidden md:flex'>
                            <li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
                                <Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
                            </li>
                            <li className='relative p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black' onClick={toggleLoginDropdown}>
                                Login
                                {loginDropdown && (
                                    <ul className='absolute left-0 top-full mt-2 w-40 bg-white text-black rounded-lg shadow-lg'>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); }} to={'/AdminAuth'}>Admin</Link>
                                        </li>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); }} to={'/MentorAuth'}>Mentor</Link>
                                        </li>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); }} to={'/StudentAuth'}>Student</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>

                        <div onClick={handleNav} className='block md:hidden'>
                            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                        </div>

                        <ul
                            className={
                                nav
                                    ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
                                    : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                            }
                        >
                            <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>BSMS.</h1>
                            <li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
                                <Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
                            </li>
                            <li className='relative p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600' onClick={toggleLoginDropdown}>
                                Login
                                {loginDropdown && (
                                    <ul className='absolute left-0 top-full mt-2 w-40 bg-white text-black rounded-lg shadow-lg'>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); handleNav(); }} to={'/AdminAuth'}>Admin</Link>
                                        </li>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); handleNav(); }} to={'/MentorAuth'}>Mentor</Link>
                                        </li>
                                        <li className='p-2 hover:bg-gray-200 cursor-pointer'>
                                            <Link onClick={() => { toggleLoginDropdown(); dispatch(dashboardFalse()); handleNav(); }} to={'/StudentAuth'}>Student</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </>
            }
        </div>
    );
}
