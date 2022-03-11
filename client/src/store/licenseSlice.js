import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import flightlog from '../apis/flightlog';

const initialState = {
    licenses: [],
    status: 'idle',
    errormsg : null
}

const licenseSlice = createSlice({
    name: 'license',
    initialState,
    reducers: {
        clearLicenses (state, action) {
            return initialState;
        },
        setLicenceStatusIdle (state, action) {
            state.status = "idle";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchLicenses.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchLicenses.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.licenses = action.payload.licenses;
            })
            .addCase(fetchLicenses.rejected, (state, action) => {
                state.status = "failed";
                state.errormsg = action.error.message;
            })
            .addCase(patchLicenses.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(patchLicenses.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.licenses = action.payload.licenses;
            })
            .addCase(patchLicenses.rejected, (state, action) => {
                state.status = "failed";
                state.errormsg = action.error.message;
            })
    }
});

export const fetchLicenses = createAsyncThunk('license/fetchLicenses', async (userId) => {
    const response = await flightlog.get(`/users/${userId}`);
    return {"licenses": response.data.licenses};
});

export const patchLicenses = createAsyncThunk("license/patchLicenses", async (data) => {
    const response = await flightlog.patch(`/users/${data.userID}`, data.patchContent);
    return {"licenses": response.data.licenses};
})

export const { clearLicenses, setLicenceStatusIdle } = licenseSlice.actions;
export default licenseSlice.reducer;