import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';

const RelatedBlogs = () => {
  const { id } = useParams(); 
  // console.log(id)

  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);
  console.log(blogs)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3 className="text-2xl font-medium pt-8 px-8 pb-5">Bài viết liên quan</h3>
      <hr />
      {blogs.length === 0 ? (
        <p className='p-8'>Không có bài viết liên quan nào.</p>
      ) : (
        <div className='space-y-4 mt-5'>
          {blogs.map((blog) => (
            <Link to={`/blogs/${blog._id}`} key={blog._id} className='flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm px-8 py-4' onClick={() => window.scrollTo(0, 0)}>
                <div className='size-14'> 
                  <img src={blog.coverImg} alt={blog.title} className='h-full w-full rounded-full ring-2 ring-blue-700' />
                </div>

                <div>
                <h4 className=' font-medium text-[#1E73BE]'>{blog.title && blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title || 'Tiêu đề không có sẵn'}</h4>
                
                <p>{blog.description && blog.description.length > 50 ? blog.description.substring(0, 50) + '...' : blog.description || 'Mô tả không có sẵn'}...</p> 
                </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedBlogs;
