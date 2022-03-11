import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import weather from '../apis/weather';

const initialState = {
    metar: null,
    taf: null,
    status: 'idle',
    errormsg: null
}

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setErrorMsg (state, action) {
            return {...state, status: 'failed', errormsg: action.payload};
        },
        clearWeather (state, action) {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchWeather.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.metar = action.payload.metar;
                state.taf = action.payload.taf;
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action);
                state.errormsg = action.error.message;
            })
    }
});

export const fetchWeather = createAsyncThunk('weather/fetchWeather', async (location) => {
    const responseMetar = await weather.get(`/metar/${location}`);
    const responseTaf = await weather.get(`/taf/${location}`);
    return { "metar": responseMetar.data, "taf": responseTaf.data};
});

export const { setErrorMsg, clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;