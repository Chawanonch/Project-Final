import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Softpower, SoftpowerType } from "../../components/models/softpower";

interface SoftpowerState {
  softpower: Softpower[];
  softpowerType: SoftpowerType[];
  loading: boolean;
  error: string | null;
}

const initialState: SoftpowerState = {
  softpower: [],
  softpowerType: [],
  loading: false,
  error: null,
};


export const getSoftpower = createAsyncThunk(
  "auth/fetchSoftpower",
  async () => {
    try {
      const Softpower = await agent.Softpower.getSoftpowers();
      const SoftpowerType = await agent.Softpower.getSoftpowerTypes();

      return {Softpower,SoftpowerType};
    } catch (error) {
      console.log("error token", error);
    }
  }
);

//#region Softpower
export const createAndUpdateSoftpower  = createAsyncThunk<Softpower, FieldValues>(
  "auth/fetchCreateAndUpdateSoftpower",
  async (data) => {
    try {
      const Softpower = await agent.Softpower.creatAndUpdateSoftpower({
        Id : data.id,
        Name : data.name,
        ImportantName : data.importantName,
        WhatIs : data.whatIs,
        Origin : data.origin,
        Refer : data.refer,
        SoftpowerTypeId : data.softpowerTypeId,
        Image : data.image,
      },data.images);
      
      return Softpower;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeSoftpower  = createAsyncThunk(
  "auth/fetchRemoveSoftpower",
  async (id:number) => {
    try {
      const Softpower = await agent.Softpower.removeSoftpower(id);
      return Softpower;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
//#endregion
//#region SoftpowerType
export const createAndUpdateSoftpowerType  = createAsyncThunk<SoftpowerType, FieldValues>(
  "auth/fetchCreateAndUpdateSoftpowerType",
  async (data) => {
    try {
      const SoftpowerType = await agent.Softpower.creatAndUpdateSoftpowerType({
        Id : data.id,
        Name : data.name,
      });
      
      return SoftpowerType;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeSoftpowerType  = createAsyncThunk(
  "auth/fetchRemoveSoftpowerType",
  async (id:number) => {
    try {
      const SoftpowerType = await agent.Softpower.removeSoftpowerType(id);
      return SoftpowerType;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
//#endregion

export const SoftpowerSlice = createSlice({
  name: "softpower",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getSoftpower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSoftpower.fulfilled, (state, action) => {
          state.loading = false;
          state.softpower = action.payload?.Softpower
          state.softpowerType = action.payload?.SoftpowerType
      })
      .addCase(getSoftpower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      //#region create update Softpower
      .addCase(createAndUpdateSoftpower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateSoftpower.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.softpower.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.softpower[index] = updated;
          } else {
            state.softpower.push(updated);
          }
      })
      .addCase(createAndUpdateSoftpower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
      //#region create update Building
      .addCase(createAndUpdateSoftpowerType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateSoftpowerType.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.softpowerType.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.softpowerType[index] = updated;
          } else {
            state.softpowerType.push(updated);
          }
      })
      .addCase(createAndUpdateSoftpowerType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
      //#endregion
  },
});

// export const {} = SoftpowerSlice.actions;

export default SoftpowerSlice.reducer;
