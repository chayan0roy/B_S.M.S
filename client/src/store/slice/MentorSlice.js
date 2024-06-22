import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mentorList: null,
    mentor: null,
    isMentor: false
};

const mentorDataSlice = createSlice({
    name: 'mentorData',
    initialState,
    reducers: {
        addMentorList(state, action) {
            state.mentorList = action.payload;
        },
        deleteMentorList(state, action) {
            state.mentorList = null;
        },

        addMentor(state, action) {
            state.mentor = action.payload;
        },
        deleteMentor(state, action) {
            state.mentor = null;
        },

        isTrueMentor(state, action) {
            state.isMentor = true;
        },
        isFalseMentor(state, action) {
            state.isMentor = false;
        },
    }
});

export const { addMentorList, deleteMentorList, addMentor, deleteMentor, isTrueMentor, isFalseMentor } = mentorDataSlice.actions;
export default mentorDataSlice.reducer;

