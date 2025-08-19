import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, TrendingUp, Users, Heart, MessageCircle, BarChart3, Sparkles } from 'lucide-react';
import axios from 'axios';

interface EngagementData {
  followers: number;
  avg_likes: number;
  avg_comments: number;
  engagement_rate: number;
}

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EngagementData | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await axios.post('http://localhost:5000/api/check-engagement', {
        username: username.trim()
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch engagement data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 3) return 'from-green-400 to-emerald-600';
    if (rate >= 1) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-600';
  };

  const getEngagementLabel = (rate: number) => {
    if (rate >= 3) return 'Excellent';
    if (rate >= 1) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-4"
            >
              <Instagram className="w-12 h-12 text-pink-400" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white">
              Insta<span className="gradient-text">Metrics</span>
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-4"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover your Instagram engagement rate with beautiful analytics and insights
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-12"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="glass rounded-2xl p-6 shadow-2xl">
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Instagram username..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  disabled={loading}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !username.trim()}
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Check Engagement
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/10">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8 mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-2">@{username}</h2>
                <div className="flex items-center justify-center text-gray-300">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-xl">{formatNumber(data.followers)} followers</span>
                </div>
              </motion.div>

              {/* Engagement Rate Circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-8 mb-8 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Engagement Rate</h3>
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - Math.min(data.engagement_rate / 10, 1)) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{data.engagement_rate}%</div>
                      <div className={`text-sm font-medium bg-gradient-to-r ${getEngagementColor(data.engagement_rate)} bg-clip-text text-transparent`}>
                        {getEngagementLabel(data.engagement_rate)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <Heart className="w-8 h-8 text-red-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Average Likes</h4>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{formatNumber(data.avg_likes)}</div>
                  <div className="text-gray-400">
                    {((data.avg_likes / data.followers) * 100).toFixed(2)}% like rate
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Average Comments</h4>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{formatNumber(data.avg_comments)}</div>
                  <div className="text-gray-400">
                    {((data.avg_comments / data.followers) * 100).toFixed(2)}% comment rate
                  </div>
                </motion.div>
              </div>

              {/* Additional Insights */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400 mr-3" />
                  <h4 className="text-xl font-semibold text-white">Engagement Insights</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{(data.avg_likes / data.avg_comments).toFixed(1)}:1</div>
                    <div className="text-gray-400">Like to Comment Ratio</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatNumber(data.avg_likes + data.avg_comments)}</div>
                    <div className="text-gray-400">Total Avg Engagement</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{Math.round(data.followers / 1000)}K</div>
                    <div className="text-gray-400">Audience Reach</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;