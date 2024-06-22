import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/AuthSlice';
import batchDataReducer from './slice/BatchSlice';
import subjectDataReducer from './slice/SubjectSlice';
import mentorDataReducer from './slice/MentorSlice';
import studentDataReducer from './slice/StdentSlice';
import dashboardDataReducer from './slice/DashBoardSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        batchData: batchDataReducer,
        subjectData: subjectDataReducer,
        mentorData: mentorDataReducer,
        studentData: studentDataReducer,
        dashboardData: dashboardDataReducer,
    },
});
