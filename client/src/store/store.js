import {combineReducers, configureStore, applyMiddleware, compose } from "@reduxjs/toolkit";
import reduxThunk from "redux-thunk";

import authReducer from "./authSlice";
import logbookReducer from "./logbookSlice";
import weatherReducer from "./weatherSlice";
import licenseReducer from "./licenseSlice";

//Orientiert an: https://github.com/kuehnert/2021-informatik-pk/blob/main/todolist-redux/src/store/store.js 
export const rootReducer = combineReducers({
    auth: authReducer,
    license: licenseReducer,
    logbook: logbookReducer,
    weather: weatherReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: rootReducer,
    devTools: composeEnhancers(applyMiddleware(reduxThunk))
});

export default store;