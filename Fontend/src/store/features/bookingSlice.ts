import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import agent from '../../components/api/agent';
import { Booking, BookingPackage, BookingPackagePayment, BookingPayment } from '../../components/models/booking';
import { FieldValues } from "react-hook-form";

interface BookingState {
    bookings: Booking[];
    booking: Booking[];
    bookingPackages: BookingPackage[];
    bookingPackage: BookingPackage[];
    payments: BookingPayment[];
    paymentPackages: BookingPackagePayment[];
    loading: boolean;
    loadingBooking: boolean;
    loadingBookingPackage: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    booking: [],
    bookingPackages: [],
    bookingPackage: [],
    payments: [],
    paymentPackages: [],
    loading: false,
    loadingBooking: false,
    loadingBookingPackage: false,
    error: null,
}

export const getBookingByUser = createAsyncThunk(
  "auth/fetchgetBookingByUser",
  async () => {
    try {
      const booking = await agent.Booking.getBookingByUser();
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getBookingAdmin = createAsyncThunk(
    "auth/fetchBookingAdmin",
    async () => {
      try {
        const booking = await agent.Booking.getBookingAdmin();
        return {booking};
      } catch (error) {
        console.log("error token", error);
      }
    }
  );
export const getPaymentBooking = createAsyncThunk(
    "auth/fetchPaymentBooking",
    async () => {
      try {
        const payment = await agent.Booking.getPaymentBooking();
        return {payment};
      } catch (error) {
        console.log("error token", error);
      }
    }
  );  
export const bookingRoomUser = createAsyncThunk<Booking, FieldValues>(
  "auth/fetchBookingRoomUser",
  async (data) => {
    try {
      const formattedlistRooms =
        data.basketRoom && data.basketRoom.map((item: { id: number; quantityRoomBuy: number; quantityRoomExcessBuy: number; }) => ({
          id: 0,
          RoomId: item.id,
          quantityRoom: item.quantityRoomBuy,
          quantityRoomExcess: item.quantityRoomExcessBuy
        }));
        
      const booking = await agent.Booking.bookingRoom({
        ListRooms: formattedlistRooms,
        Start: data.start,
        End: data.end
      });

      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const bookingRoom = createAsyncThunk<Booking, FieldValues>(
  "auth/fetchBookingRoom",
  async (data) => {
    try {
      const formattedlistRooms =
        data.roomList && data.roomList.map((roomId:number) => ({
          id: 0,
          RoomId: roomId,
          quantityRoom: 1,
          quantityRoomExcess: 0
      }));
      const booking = await agent.Booking.bookingRoom({
        Id: data.id,
        ListRooms: formattedlistRooms,
        Start: data.start,
        End: data.end,
        UserId: data.user
      });

      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const paymentBooking = createAsyncThunk<BookingPayment, FieldValues>(
  "auth/fetchPaymentBookingRoom",
  async (data) => {
    try {
      const payment = await agent.Booking.paymentBooking({
        Id: data.id,
        Status: data.status,
        BookingId: data.bookingId,
      });

      return payment;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const checkInUser  = createAsyncThunk(
  "auth/fetchCheckInUser",
  async (id:number) => {
    try {
      const booking = await agent.Booking.checkInUser(id);
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const cancelBooking  = createAsyncThunk(
  "auth/fetchCancelBooking",
  async (id:number) => {
    try {
      const booking = await agent.Booking.cancelBooking(id);
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const removeManyBookingAdmin  = createAsyncThunk(
  "auth/fetchRemoveManyBookingAdmin",
  async (ids: number[]) => {
    try {
      const booking = await agent.Booking.removeManyBookingAdmin(ids);
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getBookingPackageByUser = createAsyncThunk(
  "auth/fetchgetBookingPackageByUser",
  async () => {
    try {
      const booking = await agent.Package.getBookingPackageByUser();
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getBookingPackageAdmin = createAsyncThunk(
    "auth/fetchBookingPackageAdmin",
    async () => {
      try {
        const booking = await agent.Package.getBookingPackageAdmin();
        return {booking};
      } catch (error) {
        console.log("error token", error);
      }
    }
  );
export const bookingPackage = createAsyncThunk<BookingPackage, FieldValues>(
  "auth/fetchCreateAndUpdateBookingPackage",
  async (data) => {
    try {
      const formattedlistPackages =
        data.basketPackage && data.basketPackage.map((item: { id: number; quantityBuy: number; startTime: string; }) => ({
          id: 0,
          packageId: item.id,
          quantity: item.quantityBuy,
          start: item.startTime,
        }));
        
      const Package = await agent.Package.bookingPackage({
        Id: 0,
        ListPackages: formattedlistPackages
      });

      return Package;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const bookingPackageAdmin = createAsyncThunk<BookingPackage, FieldValues>(
  "auth/fetchCreateAndUpdateBookingPackageAdmin",
  async (data) => {
    try {
      const formattedlistPackages =
        data.packageList && data.packageList.map((packageId:number) => ({
          id: 0,
          packageId: packageId,
          quantity: 1,
          start: new Date().toISOString().split('T')[0],
        }));
        
      const Package = await agent.Package.bookingPackage({
        Id: data.id,
        ListPackages: formattedlistPackages,
        UserId: data.user
      });

      return Package;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const cancelBookingPackage  = createAsyncThunk(
  "auth/fetchCancelBookingPackage",
  async (id:number) => {
    try {
      const booking = await agent.Package.cancelBookingPackage(id);
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const checkInUserPackage  = createAsyncThunk(
  "auth/fetchCheckInUserPackage",
  async (listPackageId: number) => {
    try {
      const booking = await agent.Package.checkInUser(listPackageId);
      return booking;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const removeManyBookingPackageAdmin  = createAsyncThunk(
  "auth/fetchRemoveManyBookingPackageAdmin",
  async (ids: number[]) => {
    try {
      const packageR = await agent.Package.removeManyBookingPackageAdmin(ids);
      return packageR;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const getPaymentBookingPackages = createAsyncThunk(
  "auth/fetchGetPaymentBookingPackages",
  async () => {
    try {
      const payment = await agent.Package.getPaymentBookingPackage();
      return {payment};
    } catch (error) {
      console.log("error token", error);
    }
  }
); 
export const paymentBookingPackage = createAsyncThunk<BookingPackagePayment, FieldValues>(
  "auth/fetchPaymentBookingPackage",
  async (data) => {
    try {
      const payment = await agent.Package.paymentBookingPackage({
        Id: data.id,
        Status: data.status,
        BookingPackageId: data.bookingPackageId,
      });

      return payment;
    } catch (error) {
      console.log("error token", error);
    }
  }
); 
export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingByUser.pending, (state) => {
        state.loadingBooking = true;
        state.error = null;
      })
      .addCase(getBookingByUser.fulfilled, (state, action) => {
          state.loadingBooking = false;
          state.booking = action.payload;
      })
      .addCase(getBookingByUser.rejected, (state, action) => {
        state.loadingBooking = false;
        state.error = action.error.message as string;
      })

      .addCase(getBookingAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingAdmin.fulfilled, (state, action) => {
          state.loading = false;
          state.bookings = action.payload?.booking;
      })
      .addCase(getBookingAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(getPaymentBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentBooking.fulfilled, (state, action) => {
          state.loading = false;
          state.payments = action.payload?.payment;
      })
      .addCase(getPaymentBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(bookingRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookingRoom.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index1 = state.bookings.findIndex(x => x.id === updated.id);
        
          if (index1 !== -1) {
            state.bookings[index1] = updated;
          } else {
            state.bookings.push(updated);
          }
      })
      .addCase(bookingRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(bookingRoomUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookingRoomUser.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.booking.findIndex(x => x.id === updated.id);
          const index1 = state.bookings.findIndex(x => x.id === updated.id);
        
          if (index1 !== -1) {
            state.booking[index] = updated;
            state.bookings[index1] = updated;
          } else {
            state.booking.push(updated);
            state.bookings.push(updated);
          }
      })
      .addCase(bookingRoomUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(paymentBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentBooking.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.payments.findIndex(x => x.id === updated.id);
          const index1 = state.bookings.findIndex(x => x.id === updated.bookingId);

          if (index !== -1) {
            state.payments[index] = updated;
          } else {
            state.payments.push(updated);
          }

          if (index1 !== -1) {
            state.bookings[index1].status = updated.status === 1 ? 1 : 2;
          }
      })
      .addCase(paymentBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(bookingPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookingPackage.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index1 = state.bookingPackage.findIndex(x => x.id === updated.id);
        
          if (index1 !== -1) {
            state.bookingPackage[index1] = updated;
          } else {
            state.bookingPackage.push(updated);
          }
      })
      .addCase(bookingPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(getBookingPackageByUser.pending, (state) => {
        state.loadingBookingPackage = true;
        state.error = null;
      })
      .addCase(getBookingPackageByUser.fulfilled, (state, action) => {
          state.loadingBookingPackage = false;
          state.bookingPackage = action.payload;
      })
      .addCase(getBookingPackageByUser.rejected, (state, action) => {
        state.loadingBookingPackage = false;
        state.error = action.error.message as string;
      })

      .addCase(getBookingPackageAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingPackageAdmin.fulfilled, (state, action) => {
          state.loading = false;
          state.bookingPackages = action.payload?.booking;
      })
      .addCase(getBookingPackageAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(bookingPackageAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookingPackageAdmin.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index1 = state.bookingPackages.findIndex(x => x.id === updated.id);
        
          if (index1 !== -1) {
            state.bookingPackages[index1] = updated;
          } else {
            state.bookingPackages.push(updated);
          }
      })
      .addCase(bookingPackageAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(getPaymentBookingPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentBookingPackages.fulfilled, (state, action) => {
          state.loading = false;
          state.paymentPackages = action.payload?.payment;
      })
      .addCase(getPaymentBookingPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(paymentBookingPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentBookingPackage.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.paymentPackages.findIndex(x => x.id === updated.id);
          const index1 = state.bookingPackages.findIndex(x => x.id === updated.bookingPackageId);

          if (index !== -1) {
            state.paymentPackages[index] = updated;
          } else {
            state.paymentPackages.push(updated);
          }

          if (index1 !== -1) {
            state.bookingPackages[index1].status = updated.status === 1 ? 1 : 2;
          }
      })
      .addCase(paymentBookingPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
})

// export const {  } = userSlice.actions

export default bookingSlice.reducer