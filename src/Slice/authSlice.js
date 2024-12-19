import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    token: localStorage.getItem('token'),
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loginSuccess: function(state, action){
            state.token = action.payload.token,
            state.user = action.payload.user,
            localStorage.setItem('token', state.token)
        }
    },
    logout: function(state){
        state.token = null,
        state.user = null,
        localStorage.removeItem('token')
    }
    
})

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;