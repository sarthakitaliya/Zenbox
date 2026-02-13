"use client"
import { motion } from 'framer-motion'
import { GlowEffect } from './GlowEffect'

export const CTA = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900">
            <GlowEffect />
            
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Main CTA Card */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-700/50 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="space-y-6"
                                >
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                                        Ready to Get Started?
                                    </div>
                                    
                                    <h2 className="text-5xl font-bold text-white leading-tight">
                                        Transform Your Email
                                        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                            Productivity Today
                                        </span>
                                    </h2>
                                    
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        Join over 50,000 professionals who have revolutionized their email workflow with Zenbox. 
                                        Experience the power of AI-driven email management and never miss an important message again.
                                    </p>
                                </motion.div>
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="flex flex-col sm:flex-row gap-4"
                                >
                                    <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Start Free Trial
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                                    </button>
                                    
                                    <button className="group bg-white/10 backdrop-blur-lg text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                            Watch Demo
                                        </span>
                                    </button>
                                </motion.div>
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="flex flex-wrap items-center gap-8 text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">14-day free trial</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">Cancel anytime</span>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                {/* Success metrics display */}
                                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">Join Our Success Stories</h3>
                                        <p className="text-gray-400">See what our users are saying</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">1K+</div>
                                            <div className="text-gray-400 text-sm">Active Users</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">99.9%</div>
                                            <div className="text-gray-400 text-sm">Satisfaction Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">5hr</div>
                                            <div className="text-gray-400 text-sm">Saved Weekly</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">24/7</div>
                                            <div className="text-gray-400 text-sm">AI Processing</div>
                                        </div>
                                    </div>
                                    
                                    {/* Testimonial */}
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">S</span>
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">Sarah Chen</div>
                                                <div className="text-gray-400 text-sm">Product Manager</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 italic">
                                            "Zenbox has completely transformed how I manage my emails. The AI categorization is incredibly accurate, and I've saved hours every week. It's a game-changer!"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
} 