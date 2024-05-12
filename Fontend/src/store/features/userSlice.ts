import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Roles, User, Users } from '../../components/models/user';
import agent from '../../components/api/agent';
import { FieldValues } from 'react-hook-form';

interface UserState {
  user: User | null;
  users: Users[];
  roles: Roles[];
  token: string;
  changePage: boolean;
  loading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem('token');

const initialState: UserState = {
  user: null,
  users: [],
  roles: [],
  token: storedToken || "",
  changePage: false,
  loading: false,
  error: null
}

export const loginUser = createAsyncThunk<User, FieldValues>(
  'auth/fetchLogin',
  async (data) => {
    try {
      const response = await agent.User.loginUser({
        Email: data.emailOrUsername,
        Password: data.password,
      });
      
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const forgotPassword = createAsyncThunk<Users, FieldValues>(
  'auth/fetchForgotPassword',
  async (data) => {
    try {
      const response = await agent.User.forgotPassword({
        Email: data.email,
        NewPassword: data.newPassword,
      });
      
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getByUser = createAsyncThunk(
  'auth/fetchByUser',
  async () => {
    try {
      const response = await agent.User.getByUser();
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const getRoles = createAsyncThunk(
  'auth/fetchByRole',
  async () => {
    try {
      const response = await agent.User.getRoles();
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getUserAdmin = createAsyncThunk(
  'auth/fetchUserAdmin',
  async () => {
    try {
      const response = await agent.User.getUserAdmin();
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const registerUser = createAsyncThunk<Users, FieldValues>(
  'auth/fetchRegisterUser',
  async (data) => {
    try {
      const response = await agent.User.registerUser({
        Username : data.username,
        RoleId : data.roleId,
        Password: data.password,
        Email : data.email
      });
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const changeUser = createAsyncThunk<User, FieldValues>(
  'auth/fetchChangeUser',
  async (data) => {
    try {
      const response = await agent.User.changeUser({
        Email : data.email,
        Username : data.username,
        Phone : data.phone
      });
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const checkExpToken = createAsyncThunk(
  'auth/fetchCheckExpToken',
  async (token:string) => {
    try {
      const response = await agent.User.checkExpToken(token);
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const removeUser = createAsyncThunk(
  'auth/fetchRemove',
  async (id:number) => {
    try {
      const response = await agent.User.removeUser(id);
      return response;
    } catch (error) {
      console.log("error token", error);
    }
  }
);
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.error = null;
    },
    logout: (state) => {
      state.loading = true;
      state.error = null;
      state.token = "";
      if(state.user && state.user.role === "Admin") {
        if(state.changePage === true){
          state.changePage = !state.changePage;
        }
      }
      localStorage.removeItem('token');
    },
    changePage: (state) => {
      state.changePage = !state.changePage;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload != null || action.payload != undefined) {
          const token = String(action.payload);
          state.token = token;
          localStorage.setItem('token', token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.users.findIndex(x => x.id === updated.id);
        
        if (index !== -1) {
          state.users[index].password = String(updated);
        } else {
          state.users.push(updated);
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getUserAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.users.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.users[index] = updated;
          } else {
            state.users.push(updated);
          }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(changeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUser.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          
          state.user = updated;
      })
      .addCase(changeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
})

export const { loading, logout, changePage } = userSlice.actions

export default userSlice.reducer