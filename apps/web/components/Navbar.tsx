"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Zenbox
                    </span>
                </motion.div>

                {/* Desktop CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/auth/signin"
                            className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/auth/signin"
                            className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                    opacity: isMenuOpen ? 1 : 0, 
                    height: isMenuOpen ? "auto" : 0 
                }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-gray-800/95 backdrop-blur-xl border-t border-gray-700/50"
            >
                <div className="px-4 py-6 space-y-4">
                    <motion.div 
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium py-2"
                    >
                        Features
                    </motion.div>
                    <motion.div 
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium py-2"
                    >
                        Pricing
                    </motion.div>
                    <motion.div 
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium py-2"
                    >
                        About
                    </motion.div>
                    <motion.div 
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium py-2"
                    >
                        Contact
                    </motion.div>
                    <div className="pt-4 border-t border-gray-700/50 space-y-3">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-gray-300 hover:text-white transition-colors font-medium py-3 text-center"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-center"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
