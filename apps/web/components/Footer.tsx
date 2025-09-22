"use client"

import { footerLinks } from '@/utils/footerLinks'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { socialLinks } from '@/utils/socailLinks'
import { GlowEffect } from './GlowEffect'

export const Footer = () => {
    return (
        <footer className="relative overflow-hidden">
         <GlowEffect />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 lg:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            href={link.href}
                                            className="text-gray-700 hover:text-violet-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            href={link.href}
                                            className="text-gray-700 hover:text-violet-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            href={link.href}
                                            className="text-gray-700 hover:text-violet-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            href={link.href}
                                            className="text-gray-700 hover:text-violet-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                <div className="border-t border-gray-200/30 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-6"
                        >
                            {socialLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-700 hover:text-violet-600 transition-colors hover:scale-105 duration-300 ease-in-out"
                                    aria-label={link.name}
                                >
                                    <link.icon className="w-6 h-6" />
                                </Link>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-700 text-sm"
                        >
                            © {new Date().getFullYear()} Zenbox. All rights reserved.
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    )
} 