"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { heroFeatures } from '@/utils/hero-features'
import { GlowEffect } from './GlowEffect'

export const Hero = () => {
    return (
        <section className="relative min-h-screen overflow-hidden">
         <GlowEffect />

            <div className="relative max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> 
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h1 className="text-6xl font-bold leading-tight">
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent block mb-2"
                            >
                                Smart AI-Powered
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-gray-900"
                            >
                                Email Management
                            </motion.span>
                        </h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-xl text-gray-700"
                        >
                            Experience the future of email with Zenbox AI. Intelligent categorization, 
                            smart filtering, and automated responses powered by cutting-edge AI technology.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="flex gap-4"
                        >
                            <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                                Get Started Free
                            </button>
                            <button className="bg-white/80 backdrop-blur-lg text-violet-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-white transition-all shadow-lg hover:shadow-xl cursor-pointer">
                                Watch Demo
                            </button>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="grid grid-cols-2 gap-6 mt-12"
                        >
                            {heroFeatures.map((feature, index) => (
                                <motion.div 
                                    key={feature.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-violet-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <div className="text-violet-600 font-semibold text-lg">{feature.title}</div>
                                    <div className="text-gray-700">{feature.desc}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1200&auto=format&fit=crop"
                                alt="Zenbox AI Email Management"
                                fill
                                className="object-contain rounded-2xl"
                                priority
                            />
                        </div>
                       
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.8 }}
                            className="absolute -top-4 -right-4 bg-white/40 backdrop-blur-xl p-6 rounded-xl border border-white/20 shadow-lg"
                        >
                            <div className="text-gray-900 font-semibold">AI Accuracy</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">99.9%</div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="absolute -bottom-4 -left-4 bg-white/40 backdrop-blur-xl p-6 rounded-xl border border-white/20 shadow-lg"
                        >
                            <div className="text-gray-900 font-semibold">Time Saved</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">5hr/week</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
} 