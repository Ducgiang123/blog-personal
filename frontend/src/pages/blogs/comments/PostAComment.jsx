import React, { useState } from "react";
import { usePostCommentMutation } from "../../../redux/features/comments/commentsApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchBlogByIdQuery } from "../../../redux/features/blogs/blogsApi";

const PostAComment = ({ existingComment, setExistingComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState(existingComment ? existingComment.comment : "");
  const { user } = useSelector((state) => state.auth);
  const [postComment] = usePostCommentMutation();

  // refetching after comments
  const { refetch } = useFetchBlogByIdQuery(id, {
    skip: !id, // Skip fetching if id is not available
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn phải đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    const newComment = {
      comment: comment,
      user: user?._id,
      postId: id,
    };

    try {
      if (existingComment) {
        // Update existing comment
        await postComment({ id: existingComment._id, comment }).unwrap();
        alert("Bình luận đã được cập nhật!");
        setExistingComment(null); // Clear existing comment after update
      } else {
        // Post new comment
        await postComment(newComment).unwrap();
        alert("Đã đăng bình luận!");
      }
      setComment("");
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-8">Để lại bình luận đánh giá</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="text"
          id="text"
          cols="30"
          rows="10"
          className="w-full bg-bgPrimary focus:outline-none p-5"
          placeholder="Chia sẻ suy nghĩ của bạn về bài viết này...."
        />
        <button
          type="submit"
          className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
        >
          {existingComment ? "Cập nhật" : "Đăng"}
        </button>
      </form>
    </div>
  );
};

export default PostAComment;
