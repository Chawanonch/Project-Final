import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Comment, CommentPackage } from '../../components/models/comment';

interface CommentState {
  comment: Comment[];
  commentPackage: CommentPackage[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comment: [],
  commentPackage: [],
  loading: false,
  error: null,
};


export const getComment = createAsyncThunk(
  "auth/fetchComment",
  async () => {
    try {
      const Comment = await agent.Comment.getComments();

      return {Comment};
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const createAndUpdateComment  = createAsyncThunk<Comment, FieldValues>(
  "auth/fetchCreateAndUpdateComment",
  async (data) => {
    try {
      const Comment  = await agent.Comment.creatAndUpdateComment({
        Id : data.id,
        Text : data.text,
        Star : data.star,
        BookingId : data.bookingId,
      },data.images);
      
      return Comment;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const removeComment   = createAsyncThunk(
  "auth/fetchRemoveComment ",
  async (id:number) => {
    try {
      const Comment  = await agent.Comment.removeComment(id);
      return Comment ;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const getCommentPackage = createAsyncThunk(
  "auth/fetchCommentPackage",
  async () => {
    try {
      const Comment = await agent.Comment.getCommentPackages();

      return {Comment};
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const createAndUpdateCommentPackage  = createAsyncThunk<CommentPackage, FieldValues>(
  "auth/fetchCreateAndUpdateCommentPackage",
  async (data) => {
    try {
      const Comment  = await agent.Comment.creatAndUpdateCommentPackage({
        Id : data.id,
        Text : data.text,
        Star : data.star,
        BookingPackageId : data.bookingPackageId,
      },data.images);
      return Comment;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const removeCommentPackage   = createAsyncThunk(
  "auth/fetchRemoveCommentPackage ",
  async (id:number) => {
    try {
      const Comment  = await agent.Comment.removeCommentPackage(id);
      return Comment ;
    } catch (error) {
      console.log("error token", error);
    }
  }
);

export const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //#region get All
      .addCase(getComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComment.fulfilled, (state, action) => {
          state.loading = false;
          state.comment = action.payload?.Comment
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      //#region create update Comment
      .addCase(createAndUpdateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateComment.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.comment.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.comment[index] = updated;
          } else {
            state.comment.push(updated);
          }
      })
      .addCase(createAndUpdateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
      //#region get All
      .addCase(getCommentPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentPackage.fulfilled, (state, action) => {
          state.loading = false;
          state.commentPackage = action.payload?.Comment
      })
      .addCase(getCommentPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      //#region create update Comment
      .addCase(createAndUpdateCommentPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCommentPackage.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.commentPackage.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.commentPackage[index] = updated;
          } else {
            state.commentPackage.push(updated);
          }
      })
      .addCase(createAndUpdateCommentPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
  },
});

// export const {} = CommentSlice.actions;

export default CommentSlice.reducer;
