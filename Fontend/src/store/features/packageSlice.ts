import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Package } from "../../components/models/package";

interface BasketPackage extends Package {
  quantityBuy: number;
  startTime: string;
}

interface PackageState {
  packageAll: Package[];
  basketPackage: BasketPackage[];
  countPackage: number;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  packageAll: [],
  basketPackage: [],
  countPackage: 1,
  loading: false,
  error: null,
};

export const getPackage = createAsyncThunk("auth/fetchPackage", async () => {
  try {
    const Package = await agent.Package.getPackages();
    return Package;
  } catch (error) {
    console.log("error token", error);
  }
});

export const createAndUpdatePackage = createAsyncThunk<Package, FieldValues>(
  "auth/fetchCreateAndUpdatePackage",
  async (data) => {
    try {
      const formattedRoomPackages =
        data.roomPackages &&
        data.roomPackages.map((roomId: number) => ({
          id: 0,
          roomId: roomId,
          packageId: 0,
        }));
      const formattedSoftpowerPackages =
        data.softpowerPackages &&
        data.softpowerPackages.map((softpowerId: number) => ({
          id: 0,
          softpowerId: softpowerId,
          packageId: 0,
        }));

      const Package = await agent.Package.creatAndUpdatePackage({
        Id: data.id,
        Name: data.name,
        RoomPackages: formattedRoomPackages,
        QuantityDay: data.quantityDay,
        SoftpowerPackages: formattedSoftpowerPackages,
        QuantityPeople: data.quantityPeople,
        Precautions: data.precautions,
        TotalPrice: data.totalPrice,
        Quantity: data.quantity,
      });

      return Package;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const removePackage = createAsyncThunk(
  "auth/fetchRemovePackage ",
  async (id: number) => {
    try {
      const Package = await agent.Package.removePackage(id);
      return Package;
    } catch (error) {
      console.log("error token", error);
    }
  }
);


export const PackageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    createPackageInBasket: (state, action: PayloadAction<BasketPackage>) => {
      const existingPackageIndex = state.basketPackage.findIndex(
        (pkg) => pkg.id === action.payload.id
      );
      if (existingPackageIndex === -1) {
        // หากไม่พบแพ็คเกจที่มี id เดียวกันในตะกร้า ให้เพิ่มแพ็คเกจใหม่เข้าไป
        state.basketPackage.push(action.payload);
      } else {
        // หากพบแพ็คเกจที่มี id เดียวกันในตะกร้า ให้เพิ่มจำนวนแพ็คเกจเข้าไป
        if(state.basketPackage[existingPackageIndex].quantityBuy < state.basketPackage[existingPackageIndex].quantity)
        {
          state.basketPackage[existingPackageIndex].quantityBuy += 1;
        }
      }
      state.loading = false;
      state.error = null;
    },
    removePackageFromBasket: (state, action: PayloadAction<number>) => {
      state.basketPackage = state.basketPackage.filter(pkg => pkg.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearPackageInBasket: (state) => {
      state.basketPackage = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //#region get All
      .addCase(getPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packageAll = action.payload;
      })
      .addCase(getPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      //#region create update Package
      .addCase(createAndUpdatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.packageAll.findIndex((x) => x.id === updated.id);

        if (index !== -1) {
          state.packageAll[index] = updated;
        } else {
          state.packageAll.push(updated);
        }
      })
      .addCase(createAndUpdatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
    //#endregion
  },
});

export const { createPackageInBasket,removePackageFromBasket,clearPackageInBasket } = PackageSlice.actions;

export default PackageSlice.reducer;
