import React from 'react';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import { Link } from 'react-router-dom';

const LatestBlog = () => {
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery({});

  const truncateTitle = (title) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title;
  }

  return (
    <div className='mt-8 container mx-auto'>
      <h1 className="recent-posts">BÀI VIẾT MỚI NHẤT</h1>
      {isLoading && <div className='p-5'>Loading...</div>}
      {error && <div>{error.toString()}</div>}

      <div className='mt-8 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
        {blogs.slice(0, 8).map(blog => (
          <Link to={`/blogs/${blog._id}`} key={blog._id} className='shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105'>
            <img src={blog.coverImg} alt="" className='h-80 w-full' />
            <h2 className='text-xl p-4' title={blog.title}>{truncateTitle(blog.title)}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LatestBlog;
