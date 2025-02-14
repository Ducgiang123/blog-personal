import React, { useState } from 'react';
import Hero from './Hero';
import LatestBlog from '../blogs/LatestBlog';
import { Link } from 'react-router-dom';
import TrendingBlog from '../blogs/TrendingBlog';
import OldestBlog from '../blogs/OldestBlog';
import SearchBlog from '../blogs/SearchBlog';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';

const Home = () => {
  const [search, setSearch] = useState('');
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery({ search });

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => {
    // Logic to handle search submission
  };

  const truncateTitle = (title) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title;
  };

  return (
    <div className='bg-white text-primary container mx-auto mt-4 p-8'>
      <Hero />
      <div className="mt-[2%]">
        <SearchBlog
          search={search}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
        />
      </div>

      {isLoading && <div className='p-5'>Loading...</div>}
      {error && <div>{error.toString()}</div>}

      {search ? (
        <div className='mt-8 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
          {blogs.filter(blog => blog.title.toLowerCase().includes(search.toLowerCase())).map(blog => (
            <Link to={`/blogs/${blog._id}`} key={blog._id} className='shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105'>
              <img src={blog.coverImg} alt="" className='h-80 w-full' />
              <h2 className='text-xl p-4' title={blog.title}>{truncateTitle(blog.title)}</h2>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <LatestBlog />
          <TrendingBlog />
          <OldestBlog />
        </>
      )}
    </div>
  );
}

export default Home;
