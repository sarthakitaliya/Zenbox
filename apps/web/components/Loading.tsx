export default function Loading() {
  return (
    <div className="min-h-screen bg-[#111112] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#8ea2ff]"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
