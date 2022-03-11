import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import flightlog from '../apis/flightlog';

const initialState = {
    flightlogs: [],
    status: 'idle',
    errormsg : null
}

const logbookSlice = createSlice({
    name: 'logbook',
    initialState,
    reducers: {
        clearLogbooks (state, action) {
            return initialState;
        },
        setLogbookStatusIdle(state, action) {
            state.status = "idle";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchLogbooks.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchLogbooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.flightlogs = action.payload.logbooks;
            })
            .addCase(fetchLogbooks.rejected, (state, action) => {
                state.status = "failed";
                state.errormsg = action.error.message;
            })
            .addCase(patchLogbooks.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(patchLogbooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.flightlogs = action.payload.logbooks;
            })
            .addCase(patchLogbooks.rejected, (state, action) => {
                state.status = "failed";
                state.errormsg = action.error.message;
            })
    }
});

export const fetchLogbooks = createAsyncThunk('logbook/fetchLogbooks', async (userId) => {
    const response = await flightlog.get(`/users/${userId}`);
    return {"logbooks": response.data.flightlogs};
});

export const patchLogbooks = createAsyncThunk("logbook/patchLogbooks", async (data) => {
    const response = await flightlog.patch(`/users/${data.userID}`, data.patchContent);
    return {"logbooks": response.data.flightlogs};
})

export const { clearLogbooks, setLogbookStatusIdle } = logbookSlice.actions;
export default logbookSlice.reducer;