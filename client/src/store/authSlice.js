import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSignedIn: false,
    userId: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSignIn(state, action) {
            return {...state, isSignedIn: true, userId: action.payload};
        },
        setSignOut(state) {
            return {...state, isSignedIn: false, userId: null};
        }
    }
});

export const { setSignIn, setSignOut } = authSlice.actions;
export default authSlice.reducer;