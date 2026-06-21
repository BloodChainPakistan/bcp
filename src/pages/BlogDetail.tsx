import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { mockBlogs } from '../data/mockBlogs';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find the blog post by ID
  const blog = mockBlogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-bcp-light flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-bcp-dark mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you are looking for does not exist.</p>
        <Link to="/blogs" className="bg-bcp-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Get related posts (just take a few other posts for mock purposes)
  const relatedPosts = mockBlogs.filter(b => b.id !== id).slice(0, 3);

  return (
    <div className="bg-bcp-light min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-bcp-dark text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={blog.imageUrl} 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/blogs" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
          </Link>
          
          <div className="mb-6">
            <span className="bg-bcp-red text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {blog.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {blog.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {blog.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-[400px] object-cover"
            referrerPolicy="no-referrer"
          />
          
          <div className="p-8 md:p-12 lg:p-16">
            <div 
              className="prose prose-lg prose-red max-w-none text-gray-700
                prose-headings:text-bcp-dark prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:mb-6 prose-p:leading-relaxed
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-bcp-red prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-red-50 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-bcp-dark font-semibold">
                <Share2 className="w-5 h-5" /> Share this article
              </div>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <h3 className="text-3xl font-bold text-bcp-dark mb-10 text-center">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Link to={`/blogs/${post.id}`} className="block h-full group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-bcp-dark px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-bcp-dark mb-3 group-hover:text-bcp-red transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
