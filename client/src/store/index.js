import { configureStore } from '@reduxjs/toolkit'
import generalReducer from './generalSlice'
import blogReducer from './blogSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux'


const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({ 
    general: generalReducer,
    blog: blogReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)
