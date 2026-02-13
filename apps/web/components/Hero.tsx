"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { heroFeatures } from '@/utils/hero-features'
import { GlowEffect } from './GlowEffect'
import Link from 'next/link'

export const Hero = () => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <GlowEffect />
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            </div>

            <div className="relative max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> 
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium"
                        >
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                            AI-Powered Email Management
                        </motion.div>

                        <h1 className="text-7xl font-bold leading-tight">
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2"
                            >
                                Transform Your
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                            >
                                Email Experience
                            </motion.span>
                        </h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="text-xl text-gray-300 max-w-lg leading-relaxed"
                        >
                            Zenbox revolutionizes email management with intelligent AI that automatically categorizes, 
                            prioritizes, and organizes your inbox. Experience the future of email productivity.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/auth/signin" className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 cursor-pointer">
                                <span className="relative z-10">Get Started Free</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                            </Link>
                            <button className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Watch Demo
                                </span>
                            </button>
                        </motion.div>
                        
                        {/* Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="flex items-center gap-8 pt-8"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">1K+</div>
                                <div className="text-sm text-gray-400">Active Users</div>
                            </div>
                            <div className="w-px h-12 bg-gray-600"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">99.9%</div>
                                <div className="text-sm text-gray-400">AI Accuracy</div>
                            </div>
                            <div className="w-px h-12 bg-gray-600"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">5hr</div>
                                <div className="text-sm text-gray-400">Saved/Week</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Main mockup container */}
                        <div className="relative">
                            {/* Browser mockup */}
                            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Browser header */}
                                <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 bg-gray-600 rounded px-3 py-1 text-sm text-gray-300 ml-4">
                                        zenbox.ai
                                    </div>
                                </div>
                                
                                {/* Email interface mockup */}
                                <div className="bg-gray-900 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-white text-xl font-semibold">Inbox</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">P</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Email list */}
                                    <div className="space-y-3">
                                        {[
                                            { sender: "Google", subject: "Security alert", time: "2m", category: "Security", color: "bg-red-500" },
                                            { sender: "Neon Team", subject: "2x Compute, Self-serve HIPAA", time: "1h", category: "Updates", color: "bg-blue-500" },
                                            { sender: "Binance", subject: "Earn Your First Bitcoin", time: "3h", category: "Finance", color: "bg-yellow-500" },
                                            { sender: "Cloudairy", subject: "New design, built-in support", time: "5h", category: "Product", color: "bg-green-500" }
                                        ].map((email, index) => (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                                                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <div className={`w-3 h-3 rounded-full ${email.color}`}></div>
                                                <div className="flex-1">
                                                    <div className="text-white text-sm font-medium">{email.sender}</div>
                                                    <div className="text-gray-400 text-xs">{email.subject}</div>
                                                </div>
                                                <div className="text-gray-500 text-xs">{email.time}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating elements */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.6, duration: 0.8 }}
                                className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl"
                            >
                                <div className="text-white font-bold text-lg">AI Categorization</div>
                                <div className="text-purple-100 text-sm">99.9% accuracy</div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.8, duration: 0.8 }}
                                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-xl"
                            >
                                <div className="text-white font-bold text-lg">Time Saved</div>
                                <div className="text-blue-100 text-sm">5 hours/week</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
} 
