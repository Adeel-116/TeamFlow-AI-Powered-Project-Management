export function ChatLoader() {
  return (
    <div className="flex flex-col h-full items-center justify-center text-gray-500">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-400 mb-3" />
      <p>Loading messages...</p>
    </div>
  );
}