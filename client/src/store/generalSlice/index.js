import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    hasToken: false,
}

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        hasToken: (state, action) => {
            state.hasToken = localStorage.getItem('token') ? true : false;
        },
    }
})

export const { hasToken } = generalSlice.actions
export default generalSlice.reducer