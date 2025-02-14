import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/comments',
    credentials: 'include',
  }),
  tagTypes: ['Comments'], // Define the tag types
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (commentData) => ({
        url: '/post-comment',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
    getComments: builder.query({
      query: () => ({
        url: '/total-comments',
      })
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
      // Thêm logic để làm mới danh sách bình luận sau khi xóa
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          commentApi.util.updateQueryData('getComments', undefined, (draft) => {
            // Xóa bình luận khỏi danh sách
            return draft.filter((comment) => comment.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { comment },
      }),
      invalidatesTags: ['Comments'],
      // Thêm logic để làm mới danh sách bình luận sau khi cập nhật
      async onQueryStarted({ id, comment }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          commentApi.util.updateQueryData('getComments', undefined, (draft) => {
            const commentToUpdate = draft.find((c) => c.id === id);
            if (commentToUpdate) {
              // Cập nhật thông tin bình luận trong danh sách
              commentToUpdate.comment = comment;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    postReply: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/comments/${id}/replies`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: ['Comments'],
      // Thêm logic để làm mới danh sách bình luận sau khi thêm phản hồi
      async onQueryStarted({ id, comment }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          commentApi.util.updateQueryData('getComments', undefined, (draft) => {
            // Cập nhật danh sách bình luận với phản hồi mới
            const commentToUpdate = draft.find((c) => c.id === id);
            if (commentToUpdate) {
              commentToUpdate.replies.push(comment);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { usePostCommentMutation, useGetCommentsQuery, useDeleteCommentMutation, useUpdateCommentMutation, usePostReplyMutation } = commentApi;

export default commentApi;
