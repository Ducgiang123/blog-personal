import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../utilis/dateFormater';
import EditorJSHTML from 'editorjs-html';
import { useGetCommentsQuery } from '../../../redux/features/comments/commentsApi'; // Import the comments API

const editorJSHTML = EditorJSHTML();
const SingleBlogCard = ({ blog }) => {
    const { title, createdAt, author, content, coverImg } = blog || {};
    const htmlContent = editorJSHTML.parse(content).join('');
    const [commentCount, setCommentCount] = useState(0);

    // Fetch comment count for the blog post
    const fetchCommentCount = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/comments/count/${blog._id}`);
            const data = await response.json();
            setCommentCount(data.count);
        } catch (error) {
            console.error('Error fetching comment count:', error);
        }
    };
    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    useEffect(() => {
        fetchCommentCount();
    }, [blog]);

    return (
        <>
            <div className="bg-white p-8">
                {/* header */}
                <div>
                    <h1 className="md:text-4xl text-3xl font-medium mb-4">{title}</h1>
                    <p className="text-lg font-medium">
                        {capitalizeFirstLetter(blog.category)} {blog.category && blog.topic && ">"} {capitalizeFirstLetter(blog.topic)}
                    </p>


                    <p className="mb-6">Cập nhật vào lúc {formatDate(createdAt)} bởi <span className="text-blue-400 cursor-pointer"> {author?.username}</span></p>
                </div>
                <div>
                    <img src={coverImg} alt="" className="w-full md:h-[520px] bg-cover" />
                </div>

                {/* details */}
                <div className="mt-8 space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='space-y-3 editorjsdiv' />
                    <div>
                        <p className="text-lg font-medium">{blog.description.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}</p>
                        <span className="text-lg font-medium">Số lượt bình luận: </span>
                        <span>{commentCount} bình luận</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SingleBlogCard;
