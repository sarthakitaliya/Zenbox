export const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Zenbox AI
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
                        About Us
                    </div>
                    <div className="text-gray-700 hover:text-indigo-600 transition-color cursor-pointer">
                        Terms of Service
                    </div>
                    <div className="text-gray-700 hover:text-indigo-600 transition-color cursor-pointer">
                        Privacy Policy
                    </div>
                    <div className="text-gray-700 hover:text-indigo-600 transition-color cursor-pointer">
                        Sign In
                    </div>
                </div>
                <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                    Contact Us
                </button>
            </div>
        </div>
    )
}