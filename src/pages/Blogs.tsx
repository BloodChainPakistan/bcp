import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { mockBlogs } from '../data/mockBlogs';

export default function Blogs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the featured blog (e.g., the first one)
  const featuredBlog = mockBlogs[0];
  const regularBlogs = mockBlogs.slice(1);

  return (
    <div className="bg-bcp-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-bcp-dark mb-6">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories, insights, and educational resources about blood donation, health, and community impact.
          </p>
        </div>

        {/* Featured Post */}
        {featuredBlog && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link to={`/blogs/${featuredBlog.id}`} className="block group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-full overflow-hidden">
                  <img 
                    src={featuredBlog.imageUrl} 
                    alt={featuredBlog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-red-50 text-bcp-red px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-bcp-dark mb-4 group-hover:text-bcp-red transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredBlog.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredBlog.readTime}
                    </div>
                  </div>
                  <div className="flex items-center text-bcp-red font-semibold group-hover:translate-x-2 transition-transform">
                    Read Full Article <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Recent Posts Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-bcp-dark mb-8">Recent Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Link to={`/blogs/${blog.id}`} className="block h-full group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-bcp-dark px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-bcp-dark mb-3 group-hover:text-bcp-red transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {blog.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {blog.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
