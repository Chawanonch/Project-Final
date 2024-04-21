import { Building } from "../../components/models/building";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { Room, RoomType } from "../../components/models/room";
import { FieldValues } from "react-hook-form";

interface BasketRoom extends Room {
  quantityRoomBuy: number;
  quantityRoomExcessBuy: number;
}

interface RoomState {
  building: Building[];
  room: Room[];
  roomType: RoomType[];
  basketRoom: BasketRoom[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  building: [],
  room: [],
  roomType: [],
  basketRoom: [],
  loading: false,
  error: null,
};


export const getBuildingAndRoom = createAsyncThunk(
  "auth/fetchBuildingAndRoom",
  async () => {
    try {
      const building = await agent.Building.getBuilding();
      const room = await agent.Room.getRooms();
      const roomType = await agent.Room.getRoomTypes();

      return {building,room,roomType};
    } catch (error) {
      console.log("error token", error);
    }
  }
);

//#region Building
export const createAndUpdateBuilding  = createAsyncThunk<Building, FieldValues>(
  "auth/fetchCreateAndUpdateBuilding",
  async (data) => {
    try {
      const building = await agent.Building.creatAndUpdateBuilding({
        Id : data.id,
        Name : data.name,
        Location : data.location,
        Image : data.image
      });
      
      return building;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeBuilding  = createAsyncThunk(
  "auth/fetchRemoveBuilding",
  async (id:number) => {
    try {
      const building = await agent.Building.removeBuilding(id);
      return building;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
//#endregion
//#region Room
export const createAndUpdateRoom  = createAsyncThunk<Room, FieldValues>(
  "auth/fetchCreateAndUpdateRoom",
  async (data) => {
    try {
      const room = await agent.Room.creatAndUpdateRoom({
        Id : data.id,
        BuildingId : data.buildingId,
        RoomTypeId : data.roomTypeId,
        QuantityRoom : data.quantityRoom,
        QuantityPeople : data.quantityPeople,
        Detail : data.detail,
        Price : data.price,
        Image : data.image,
      },data.images);
      
      return room;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeRoom  = createAsyncThunk(
  "auth/fetchRemoveRoom",
  async (id:number) => {
    try {
      const room = await agent.Room.removeRoom(id);
      return room;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
//#endregion
//#region RoomType
export const createAndUpdateRoomType  = createAsyncThunk<RoomType, FieldValues>(
  "auth/fetchCreateAndUpdateRoomType",
  async (data) => {
    try {
      const roomType = await agent.Room.creatAndUpdateRoomType({
        Id : data.id,
        Name : data.name,
      });
      
      return roomType;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeroomType  = createAsyncThunk(
  "auth/fetchRemoveRoomType",
  async (id:number) => {
    try {
      const roomType = await agent.Room.removeRoomType(id);
      return roomType;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
//#endregion

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    createRoomInBasket: (state, action: PayloadAction<BasketRoom>) => {
      const existingRoomIndex = state.basketRoom.findIndex(
        (pkg) => pkg.id === action.payload.id
      );
      if (existingRoomIndex === -1) {
        state.basketRoom.push(action.payload);
      } else {
        // หากพบแพ็คเกจที่มี id เดียวกันในตะกร้า ให้เพิ่มจำนวนแพ็คเกจเข้าไป
        if(state.basketRoom[existingRoomIndex].quantityRoomBuy < state.basketRoom[existingRoomIndex].quantityRoom)
        {
          state.basketRoom[existingRoomIndex].quantityRoomBuy += action.payload.quantityRoomBuy;
        }
      }
      state.loading = false;
      state.error = null;
    },
    removeRoomFromBasket: (state, action: PayloadAction<number>) => {
      state.basketRoom = state.basketRoom.filter(pkg => pkg.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearRoomInBasket: (state) => {
      state.basketRoom = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getBuildingAndRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBuildingAndRoom.fulfilled, (state, action) => {
          state.loading = false;
          state.building = action.payload?.building;
          state.room = action.payload?.room
          state.roomType = action.payload?.roomType
      })
      .addCase(getBuildingAndRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      //#region create update Building
      .addCase(createAndUpdateBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateBuilding.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.building.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.building[index] = updated;
          } else {
            state.building.push(updated);
          }
      })
      .addCase(createAndUpdateBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
      //#region create update Room
      .addCase(createAndUpdateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateRoom.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.room.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.room[index] = updated;
          } else {
            state.room.push(updated);
          }
      })
      .addCase(createAndUpdateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
      //#region create update Building
      .addCase(createAndUpdateRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateRoomType.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.roomType.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.roomType[index] = updated;
          } else {
            state.roomType.push(updated);
          }
      })
      .addCase(createAndUpdateRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
      //#endregion
  },
});

export const { createRoomInBasket,removeRoomFromBasket,clearRoomInBasket } = roomSlice.actions;

export default roomSlice.reducer;
