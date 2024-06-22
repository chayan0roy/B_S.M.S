import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    newBatchList: null,
    batchList: null,
    batchID: null,
    batch: null,

    noticeList: null,
    notice: null,
    isNotice: false
};

const batchDataSlice = createSlice({
    name: 'batchData',
    initialState,
    reducers: {
        addNewBatchList(state, action) {
            state.newBatchList = action.payload;
        },

        addBatchList(state, action) {
            state.batchList = action.payload;
        },
        deleteBatchList(state, action) {
            state.batchList = null;
        },

        addBatchID(state, action) {
            state.batchID = action.payload;
        },
        deleteBatchID(state, action) {
            state.batchID = null;
        },

        addBatch(state, action) {
            state.batch = action.payload;
        },
        deleteBatch(state, action) {
            state.batch = null;
        },

        addNoticeList(state, action) {
            state.noticeList = action.payload;
        },
        deleteNoticeList(state, action) {
            state.noticeList = null;
        },
        addNotice(state, action) {
            state.notice = action.payload;
        },
        deleteNotice(state, action) {
            state.notice = null;
        },
        isTrueNotice(state, action) {
            state.isNotice = true;
        },
        isFalseNotice(state, action) {
            state.isNotice = false;
        },
    }
});

export const {
    addNewBatchList,
    addBatchList,
    deleteBatchList,
    addBatchID,
    deleteBatchID,
    addBatch,
    deleteBatch,
    addNoticeList,
    deleteNoticeList,
    addNotice,
    deleteNotice,
    isTrueNotice,
    isFalseNotice
} = batchDataSlice.actions;

export default batchDataSlice.reducer;

