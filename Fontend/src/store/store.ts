import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import userSlice from './features/userSlice'
import roomSlice from './features/room&BuildingSlice'
import bookingSlice from './features/bookingSlice';
import commentSlice from './features/commentSlice';
import softpowerSlice from './features/softpowerSlice';
import packageSlice from './features/packageSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    room: roomSlice,
    booking: bookingSlice,
    softpower: softpowerSlice,
    package: packageSlice,
    comment: commentSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;