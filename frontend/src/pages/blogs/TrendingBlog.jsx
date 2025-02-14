import React, { useState, useEffect } from 'react';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const TrendingBlog = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({ search: '' });
  const [blogs, setBlogs] = useState([]);

  const { data: fetchedBlogs = [], error, isLoading } = useFetchBlogsQuery(query);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const blogsWithComments = await Promise.all(fetchedBlogs.map(async (blog) => {
        const response = await fetch(`http://localhost:5000/api/comments/count/${blog._id}`);
        const data = await response.json();
        return { ...blog, commentCount: data.count };
      }));
      // Sort blogs by comment count and filter out those with less than 1 comment
      setBlogs(blogsWithComments
        .filter(blog => blog.commentCount >= 1)
        .sort((a, b) => b.commentCount - a.commentCount));
    };

    if (fetchedBlogs.length > 0) {
      fetchCommentCounts();
    }
  }, [fetchedBlogs]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search });

  const truncateTitle = (title) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title;
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mt-8 container mx-auto'>
      <h1 className="recent-posts">TRENDING</h1>
      {isLoading && <div className='p-5'>Loading...</div>}
      {error && <div>{error.toString()}</div>}

      <Carousel responsive={responsive}>
        {filteredBlogs.map(blog => (
          <div key={blog._id} className='p-4'>
            <Link to={`/blogs/${blog._id}`} className='shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105'>
              <img src={blog.coverImg} alt="" className='h-80 w-full' />
              <h2 className='text-xl p-4 hover:text-blue-500' title={blog.title}>{truncateTitle(blog.title)}</h2>
              <p className='p-4'>Số lượt bình luận: {blog.commentCount}</p>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default TrendingBlog;
