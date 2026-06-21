import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockBlogs } from '../../data/mockBlogs';

export default function BlogPreview() {
  const posts = mockBlogs.slice(0, 3);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Knowledge Hub</h2>
          <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark">Latest from our Blog</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/blogs/${post.id}`} className="group cursor-pointer block">
                <div className="rounded-3xl overflow-hidden mb-6 aspect-[4/3]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-bcp-red font-semibold text-sm mb-3">{post.category}</div>
                <h4 className="text-2xl font-bold text-bcp-dark mb-4 group-hover:text-bcp-red transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <span className="text-bcp-dark font-semibold flex items-center gap-2 group-hover:text-bcp-red transition-colors">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-bcp-dark px-8 py-4 rounded-full font-semibold transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
