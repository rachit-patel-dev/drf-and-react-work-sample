// Third party import
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IInviteUserState {
    isDrawerOpen: boolean;
    currentPage: number;
    callOfUsers: boolean;
    callFilterDivisionList: boolean;
}


const initialState: IInviteUserState = {
    isDrawerOpen: false,
    currentPage: 1,
    callOfUsers: true,
    callFilterDivisionList: true
}

export const inviteUserSlice = createSlice({
    name: "addNewUser",
    initialState,
    reducers: {
        setIsDrawerOpen: (
            state: { isDrawerOpen: boolean },
            action: PayloadAction<boolean>
        ) => {
            state.isDrawerOpen = action.payload;
        },
        setCurrentPage: (
            state: { currentPage: number },
            action: PayloadAction<number>
        ) => {
            state.currentPage = action.payload;
        },
        setCallOfUsers: (
            state: { callOfUsers: boolean },
            action: PayloadAction<boolean>
        ) => {
            state.callOfUsers = action.payload;
        },
        setCallFilterDivisionList: (
            state: { callFilterDivisionList: boolean },
            action: PayloadAction<boolean>
        ) => {
            state.callFilterDivisionList = action.payload;
        },
    
    }
});
  
export const {
setIsDrawerOpen,
setCurrentPage,
setCallOfUsers,
setCallFilterDivisionList
} = inviteUserSlice.actions;

export default inviteUserSlice.reducer;