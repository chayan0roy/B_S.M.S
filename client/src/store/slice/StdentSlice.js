import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    studentList: null,
    student: null,
    isStudent: false
};

const studentDataSlice = createSlice({
    name: 'studentData',
    initialState,
    reducers: {
        addStudentList(state, action) {
            state.studentList = action.payload;
        },
        deleteStudentList(state, action) {
            state.studentList = null;
        },

        addStudent(state, action) {
            state.student = action.payload;
        },
        deleteStudent(state, action) {
            state.student = null;
        },

        isTrueStudent(state, action) {
            state.isStudent = true;
        },
        isFalseStudent(state, action) {
            state.isStudent = false;
        },
    }
});

export const { addStudentList, deleteStudentList, addStudent, deleteStudent, isTrueStudent, isFalseStudent } = studentDataSlice.actions;
export default studentDataSlice.reducer;

