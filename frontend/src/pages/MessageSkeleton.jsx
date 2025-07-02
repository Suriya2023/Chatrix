const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto space-y-6 animate-pulse">
      {skeletonMessages.map((_, idx) => {
        const isStart = idx % 2 === 0;

        return (
          <div
            key={idx}
            className={`flex ${isStart ? "justify-start" : "justify-end"} px-2 sm:px-4`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] sm:max-w-[70%] ${
                isStart ? "" : "flex-row-reverse"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-base-200 border" />

              <div className="space-y-2 w-full">
                <div className="h-3 w-20 bg-base-200 rounded-md" />
                <div className="bg-base-200 rounded-lg p-3 w-full">
                  <div className="h-4 w-40 bg-base-300 rounded" />
                  <div className="h-4 w-32 bg-base-300 rounded mt-2" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
