import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    hasToken: false,
    isLoading: false
}

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        hasToken: (state, action) => {
            state.hasToken = action.payload
        },
        isLoading: (state, action) => {
            state.isLoading = action.payload
        },
    }
})

export const { hasToken, isLoading } = generalSlice.actions
export default generalSlice.reducer