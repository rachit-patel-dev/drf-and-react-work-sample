// Third party
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

// Reducer
import authReducer from "./Reducers/AuthModule/auth";
import reviewReducer from "./Reducers/review";
import planningReducer from "./Reducers/planning";
import generalSettingsReducer from "./Reducers/generalSettings";
import globalFiltersReducers from "./Reducers/globalFilters";
import inviteUserReducer from "./Reducers/inviteUser";


const reducer = combineReducers({
  inviteUserReducer,
  authReducer,
  reviewReducer,
  planningReducer,
  generalSettingsReducer,
  globalFiltersReducers,
});

const store = configureStore({
  reducer,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
