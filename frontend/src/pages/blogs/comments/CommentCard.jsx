import React, { useState } from "react";
import CommentorIcon from "../../../assets/commentor.png";
import { formatDate } from "../../../utilis/dateFormater";
import PostAComment from "./PostAComment";
import { useSelector } from "react-redux";
import { useDeleteCommentMutation, useUpdateCommentMutation, usePostReplyMutation } from "../../../redux/features/comments/commentsApi";

const CommentCard = ({ comments, setComments }) => {
  const user = useSelector((state) => state.auth.user);
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [postReply] = usePostReplyMutation();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [message, setMessage] = useState('');

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId).unwrap();
      alert('Bình luận đã được xóa');
      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
      setMessage('Bình luận đã được xóa');
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage('Không thể xóa bình luận');
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setNewCommentText(comment.comment);
  };

  const handleUpdate = async (commentId) => {
    if (!newCommentText) {
      alert('Vui lòng nhập bình luận trước khi cập nhật.');
      return;
    }
    try {
      await updateComment({ id: commentId, comment: newCommentText }).unwrap();
      alert('Bình luận đã được cập nhật');
      // Cập nhật state comments mà không reload trang
      setComments((prevComments) =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, comment: newCommentText } : comment
        )
      );
      setEditingCommentId(null);
      setNewCommentText('');
      setMessage('Bình luận đã được cập nhật');
    } catch (error) {
      console.error('Error updating comment:', error);
      setMessage('Không thể cập nhật bình luận');
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText) {
      alert('Vui lòng nhập phản hồi trước khi gửi.');
      return;
    }
    try {
      // Gửi phản hồi qua API
      const newReply = await postReply({ id: commentId, comment: replyText }).unwrap();
      alert('Đã thêm phản hồi');
      // Cập nhật state comments: thêm phản hồi mới vào mảng replies của bình luận tương ứng
      setComments((prevComments) =>
        prevComments.map(comment =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
      setReplyText('');
      setReplyingToCommentId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      setMessage('Không thể thêm phản hồi');
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="my-6 bg-white p-8">
      <div>
        {comments.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium">Tất cả bình luận...</h3>
            <div>
              {comments.map((comment, index) => (
                <div key={comment._id} className="mt-4">
                  <div className="flex gap-4 items-center">
                    <img src={CommentorIcon} alt="" className="h-14" />
                    <div className="space-y-1">
                      <p className="text-lg font-medium underline capitalize underline-offset-4 text-blue-400">
                        {comment.user.username}
                      </p>
                      <p className="text-[12px] italic">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-600 mt-5 border p-8">
                    {editingCommentId === comment._id ? (
                      <div className="flex flex-col">
                        <textarea
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="border p-2 w-full rounded"
                        />
                        <div className="flex mt-2 space-x-2">
                          <button 
                            onClick={() => handleUpdate(comment._id)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                          >
                            Cập nhật
                          </button>
                          <button 
                            onClick={() => setEditingCommentId(null)} 
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="md:w-4/5">{comment.comment}</p>
                    )}
                    {user && (user._id === comment.user._id || user.role === 'cộng tác viên' || user.role === 'quản trị viên') && !editingCommentId && (
                      <div className="mt-2">
                        <button onClick={() => handleEdit(comment)} className="text-blue-500">
                          Chỉnh sửa
                        </button>
                        <button onClick={() => handleDelete(comment._id)} className="text-red-500 ml-2">
                          Xóa
                        </button>
                      </div>
                    )}
                    <button onClick={() => setReplyingToCommentId(comment._id)} className="text-green-500 mt-2">
                      Trả lời
                    </button>
                    {replyingToCommentId === comment._id && (
                      <div className="flex flex-col">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="border p-2 w-full rounded"
                          placeholder="Nhập phản hồi của bạn..."
                        />
                        <div className="flex mt-2 space-x-2">
                          <button 
                            onClick={() => handleReply(comment._id)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                          >
                            Gửi phản hồi
                          </button>
                          <button 
                            onClick={() => setReplyingToCommentId(null)} 
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <div>
                        <p className="text-gray-500 mt-2 cursor-pointer" onClick={() => toggleReplies(comment._id)}>
                          Xem {comment.replies.length} phản hồi
                        </p>
                        {showReplies[comment._id] && (
                          <div>
                            {comment.replies.map((reply, index) => (
                              <div key={index} className="mt-2">
                                <p className="text-gray-600">{reply.comment}</p>
                                <p className="text-[12px] italic">
                                  {formatDate(reply.createdAt)} - <span className="font-bold">{reply.user?.username ? reply.user.username : "Ẩn danh"}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-lg font-medium">Không có bình luận nào cho bài viết này!</div>
        )}
      </div>

      <PostAComment />
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
};

export default CommentCard;
