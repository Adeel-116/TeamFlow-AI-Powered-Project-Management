"use client"
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-full shadow-lg hover:scale-105 transition-transform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.47-1.03L3 20l1.59-3.42A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-600">
        Select a user to start chat
      </h2>
      <p className="text-gray-400 text-sm mt-1">
        Choose a contact from the list and start your conversation 💬
      </p>
    </div>
  );
}