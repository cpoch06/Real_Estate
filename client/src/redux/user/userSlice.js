import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        upDateUserStart: (state) => {
            state.loading = true;
        },
        upDateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        upDateUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },

        deleteUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },

        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        signOutStart: (state) => {
            state.loading = true;
        },

        signOutSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },

        signOutFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }        
    }
});

export const {  signInStart, signInSuccess, signInFail, 
                upDateUserStart, upDateUserSuccess, upDateUserFail,
                deleteUserStart, deleteUserSuccess, deleteUserFail,
                signOutStart, signOutSuccess, signOutFail 
            
            } = userSlice.actions;

export default userSlice.reducer;