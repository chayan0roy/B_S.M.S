import './App.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './store/slice/AuthSlice';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from './components/navBar/Navbar';

import Home from './pages/home/Home';
import AdminAuth from './pages/auth/AdminAuth';
import MentorAuth from './pages/auth/MentorAuth';
import StudentAuth from './pages/auth/StudentAuth';
import ApproveByOTP from './pages/auth/ApproveByOTP';
import PasswordResetLink from './pages/auth/PasswordResetLink';
import PasswordChange from './pages/auth/PasswordChange';

import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
	const dispatch = useDispatch();
	const whoIsLogin = useSelector((state) => state.auth.user);
	const isDashboard = useSelector((state) => state.dashboardData.dashboard);

	useEffect(() => {
		checkAuth();
	}, [whoIsLogin]);

	const checkAuth = async () => {
		const token = Cookies.get('auth_token');
		const role = Cookies.get('role');
		if (token && role) {
			try {
				const result = await axios.post(`${process.env.REACT_APP_API_URL}/checkAuth`, null, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (result.data.status) {
					dispatch(login(role));
				} else {
					Cookies.remove('auth_token');
					Cookies.remove('role');
					dispatch(logout());
				}
			} catch (error) {
				Cookies.remove('auth_token');
				Cookies.remove('role');
				dispatch(logout());
			}
		} else {
			dispatch(logout());
		}
	};

	const renderAuthRoutes = () => (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/AdminAuth" element={<AdminAuth />} />
			<Route path="/MentorAuth" element={<MentorAuth />} />
			<Route path="/StudentAuth" element={<StudentAuth />} />
			<Route path="/ApproveByOTP" element={<ApproveByOTP />} />
			<Route path="/PasswordResetLink" element={<PasswordResetLink />} />
			<Route path="/PasswordChange/:id/:token" element={<PasswordChange />} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);

	const renderDashboardRoutes = () => {
		switch (whoIsLogin) {
			case "Admin":
				return isDashboard ? <AdminDashboard /> : renderCommonRoutes();
			case "Mentor":
				return isDashboard ? <MentorDashboard /> : renderCommonRoutes();
			case "Student":
				return isDashboard ? <StudentDashboard /> : renderCommonRoutes();
			default:
				return <Navigate to="/" />;
		}
	};

	const renderCommonRoutes = () => (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);

	return (
		<Router>
			<Navbar />
			{whoIsLogin ? renderDashboardRoutes() : renderAuthRoutes()}
		</Router>
	);
}

export default App;
