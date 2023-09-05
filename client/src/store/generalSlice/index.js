import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    hasToken: false,
}

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        hasToken: (state, action) => {
            state.hasToken = action.payload
        },
    }
})

export const { hasToken } = generalSlice.actions
export default generalSlice.reducer