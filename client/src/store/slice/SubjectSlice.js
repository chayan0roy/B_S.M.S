import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    subjectList: [],
    isSubject: false
};

const subjectDataSlice = createSlice({
    name: 'subjectData',
    initialState,
    reducers: {
        addSubjectList(state, action) {
            state.subjectList = action.payload;
        },
        deleteSubjectList(state, action) {
            state.subjectList = [];
        },
        isTrueSubject(state, action) {
            state.isSubject = true;
        },
        isFalseSubject(state, action) {
            state.isSubject = false;
        },
    }
});

export const { addSubjectList, deleteSubjectList, isTrueSubject, isFalseSubject } = subjectDataSlice.actions;
export default subjectDataSlice.reducer;
