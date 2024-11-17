export default function CardSkeleton() {
  return (
    <div className="w-full max-w-sm bg-violet-700/50 shadow-lg rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[16/9]">
        <div className="w-full h-full bg-gray-400/50 rounded-t-lg"></div>
      </div>
      <div className="p-4">
        <div className="h-14 flex items-center justify-center">
          <div className="w-3/4 h-4 bg-gray-400/50 rounded"></div>
        </div>
      </div>
    </div>
  );
}
