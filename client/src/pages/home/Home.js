import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Cookies from "js-cookie";
import Input from "../../components/inputField/Input";
import Button from "../../components/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { addNewBatchList } from "../../store/slice/BatchSlice";

export default function Home() {
	const dispatch = useDispatch();
	const whoIsLogin = useSelector((state) => state.auth.user);

	const [whyLearn, setWhyLearn] = useState("");
	const [isPopup, setIsPopup] = useState({ boolean: true, id: null });
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		handlegetallCource();
	}, []);

	const handlegetallCource = async () => {
		try {
			const result = await axios.get(
				`${process.env.REACT_APP_API_URL}/Student/getAllCouece`
			);

			if (result.data.status === true) {
				setCourses(result.data.batchData);
			} else {
				alert(result.data.message);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleJoin = async () => {

		const token = Cookies.get("auth_token");

		if (token) {
			const formData = new FormData();
			formData.append("id", isPopup.id);
			formData.append("whyLearn", whyLearn);

			try {
				const result = await axios.post(
					`${process.env.REACT_APP_API_URL}/Student/registerNewBatch`,
					formData,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (result.data.status === true) {
					alert("Batch Register Successfll!!!");
				} else {
					alert(result.data.message);
				}
			} catch (error) {
				alert(error);
			}
		}
		setIsPopup({ boolean: true, id: null });
	};

	return (
		<div className="Home pt-20">
			{isPopup.boolean ? (
				courses.map((course) => (
					<div key={course.id} className="card">
						<img
							src={`${process.env.REACT_APP_API_URL}/uploads/${course.profileIMG}`}
							alt={course.courseName}
						/>
						<h1>{course.courseName}</h1>
						<div>
							{course.subjectList.map((sub) => (
								<h3 key={sub}>{sub}</h3>
							))}
						</div>
						<h4>{course.monthlyFees}</h4>
						<h4>{course.totalFees}</h4>
						{whoIsLogin === "Student" && (
							 <button onClick={() => setIsPopup({ boolean: false, id: course._id })}>Join</button>
						)}
					</div>
				))
			) : (
				<>
					<button onClick={() => setIsPopup({ boolean: true, id: null })}>
						Cross
					</button>
					<input type="text" placeholder="Why do you want to learn" onChange={(e)=>setWhyLearn(e.target.value)}/>
					<button onClick={handleJoin}>Submit</button>
				</>
			)}
		</div>
	);
}







//     let newBatchList = useSelector(state => state.batchData.newBatchList);

//     const [whyLearn, setWhyLearn] = useState('');
//     const [isPopup, setIsPopup] = useState({ boolean: true, id: null });

//     useEffect(() => {
//         Handle_Get_All_New_Batch();
//     }, []);

//     const Handle_Get_All_New_Batch = async () => {
//         const token = Cookies.get('auth_token');
//         const role = Cookies.get('role');

//         if (token && role && role === "Student") {
//             try {
//                 const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/getAllNewBatch`,
//                     null,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 if (result.data.status === true) {
//                     dispatch(addNewBatchList(result.data.batchData));
//                 } else {
//                     alert(result.data.message);
//                 }
//             } catch (error) {
//                 alert(error.message);
//             }
//         }
//     };

//     // if (batchData) {
//     //     const classStartDate = new Date(batchData.classStartDate);
//     //     const currentDate = new Date();
//     //     currentDate.setUTCHours(0, 0, 0, 0);
//     //     const timeDifference = classStartDate - currentDate;
//     //     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     //     console.log(days);
//     // }

//     const RegisterNewBatch = async () => {
//         const token = Cookies.get('auth_token');
//         const role = Cookies.get('role');

//         if (token && role && role === "Student") {

//             const formData = new FormData();
//             formData.append("id", isPopup.id);
//             formData.append("whyLearn", whyLearn);

//             try {
//                 const result = await axios.post(`${process.env.REACT_APP_API_URL}/Student/registerNewBatch`, formData, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`
//                     }
//                 });

//                 if (result.data.status === true) {
//                     alert("Batch Register Successfll!!!")
//                 }
//                 else {
//                     alert(result.data.message)
//                 }
//             } catch (error) {
//                 alert(error)
//             }
//         }
//         setIsPopup({ boolean: true, id: null });
//     }

//     return (
//         <div>
//             {
//                 isPopup.boolean ?
//                     newBatchList && Array.isArray(newBatchList) && newBatchList.length !== 0 ?
//                         newBatchList.map((data) => {
//                             return (
//                                 <div key={data.id}> {/* Added key prop */}
//                                     <div className='card'>
//                                         <img src='' alt='course image'></img>
//                                         <div>
//                                             <h2>{data.courseName}</h2>
//                                             <h2>{data.batchName}</h2>
//                                             <h3>{data.admissionFees}</h3>
//                                             <h3>{data.monthlyFees}</h3>
//                                             <div>
//                                                 <img src='' alt='mentor image'></img>
//                                                 <img src='' alt='mentor image'></img>
//                                             </div>
//                                             <button onClick={() => setIsPopup({ boolean: false, id: data._id })}>Join</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                         :
//                         <></>
//                     :
//                     <>
//                         <button onClick={() => setIsPopup({ boolean: true, id: null })}>Cross</button>
//                         <Input className={"input_box"} placeholder={"Why are you want to learn"} type={"text"} fun={setWhyLearn} />
//                         <button onClick={() => RegisterNewBatch()}>Submit</button>
//                     </>
//             }
//         </div>
//     );

// }
