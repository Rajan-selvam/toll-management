import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  tollList: [],
  tollLogs: [],
};

//add new toll
export const addNewToll = createAsyncThunk(
  "add-new/toll",
  async (newTollData) => {
    let tollList = await JSON.parse(localStorage.getItem('tollList'));
    let tollListData = [];
    tollListData.push(newTollData);
    if(tollList && tollList.length > 0) {
      tollListData.push(...tollList);
    } 
    await localStorage.setItem('tollList',JSON.stringify(tollListData));
    return newTollData;
  }
);

//get all toll
export const getAllToll = createAsyncThunk(
  "get-all/toll",
  async () => {
    let tollList = await JSON.parse(localStorage.getItem('tollList'));
    return tollList;
  }
);

//delete toll
export const deleteToll = createAsyncThunk(
  "delete-toll",
  async (tollName) => {
    let tollLists = await JSON.parse(localStorage.getItem('tollList'));
    const result = tollLists.filter(toll => tollName !== toll[`TOLL NAME`]);
    await localStorage.setItem('tollList',JSON.stringify(result));
    return result;
  }
);

//add new vehicle logs
export const addNewVehicleLog = createAsyncThunk(
  "add-new/toll-entry",
  async (newVehicleEntry) => {
    let tollLogs = await JSON.parse(localStorage.getItem('tollLogs'));
    let tollLogsData = [];
    tollLogsData.push(newVehicleEntry);
    if(tollLogs && tollLogs.length > 0) {
      tollLogsData.push(...tollLogs);
    } 
    await localStorage.setItem('tollLogs',JSON.stringify(tollLogsData));
    return newVehicleEntry;
  }
);

//get all vehicle logs
export const getAllVehicleLog = createAsyncThunk(
  "get-all/toll-entry",
  async () => {
    let tollLogs = await JSON.parse(localStorage.getItem('tollLogs'));
    return tollLogs;
  }
);

export const tollGateSlice = createSlice({
  name: 'tollGate',
  initialState,
  reducers: { 
  },
  extraReducers: (builder) => {
    builder.addCase(addNewToll.pending, (state) => {
      if(state.tollList === null || state.tollList.length === 0){
        state.tollList = [];
      }
      state.tollList = [...state.tollList];
    });
    builder.addCase(addNewToll.fulfilled, (state, action) => {
      state.tollList.push(action.payload);
    });
    builder.addCase(getAllToll.fulfilled, (state, action) => {
      state.tollList = action.payload;
    });
    builder.addCase(deleteToll.fulfilled, (state, action) => {
      state.tollList = action.payload;
    });
    builder.addCase(addNewVehicleLog.pending, (state) => {
      if(state.tollLogs === null || state.tollLogs.length === 0) {
        state.tollLogs = [];
      }
      state.tollLogs = [...state.tollLogs];
    });
    builder.addCase(addNewVehicleLog.fulfilled, (state, action) => {
      state.tollLogs.push(action.payload);
    });
    builder.addCase(getAllVehicleLog.fulfilled, (state, action) => {
      state.tollLogs = action.payload;
    });
  },
});

export default tollGateSlice.reducer;
