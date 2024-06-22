import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: false,
};

const dashboardDataSlice = createSlice({
    name: 'dashboardData',
    initialState,
    reducers: {
        dashboardTrue(state, action) {
            state.dashboard = true;
        },
        dashboardFalse(state, action) {
            state.dashboard = false;
        },
    }
});

export const { dashboardTrue, dashboardFalse } = dashboardDataSlice.actions;

export default dashboardDataSlice.reducer;
