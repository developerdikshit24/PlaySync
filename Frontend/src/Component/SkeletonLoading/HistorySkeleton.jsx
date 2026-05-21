const HistoryPageSkeleton = () => {
    return (
        <div className="flex justify-between gap-4 mt-16 p-4 w-full">
            {/* Left Side: Tweet-like Skeleton */}
            <div className="w-full lg:w-2/3 space-y-4">
                <h2 className="text-3xl font-bold skeleton w-40 h-8 rounded"></h2>
                <div className="skeleton w-full h-6 rounded"></div>

                <div className="bg-base-200 p-4 rounded-lg relative">
                    {/* User info */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="skeleton w-12 h-12 rounded-full"></div>
                        <div>
                            <div className="skeleton w-32 h-4 mb-1 rounded"></div>
                            <div className="skeleton w-24 h-3 rounded"></div>
                        </div>
                    </div>

                    {/* Title and description */}
                    <div className="space-y-2 mb-4">
                        <div className="skeleton h-5 w-2/3 rounded"></div>
                        <div className="skeleton h-4 w-1/2 rounded"></div>
                    </div>

                    {/* Image placeholder */}
                    <div className="skeleton w-full h-64 max-w-xs rounded mx-auto"></div>
                </div>
            </div>

            {/* Right Side: Manage History */}
            <div className="hidden lg:flex flex-col gap-4 w-1/3">
                <div className="skeleton h-8 w-48 rounded"></div>
                <div className="skeleton h-4 w-40 rounded"></div>
                <div className="skeleton h-10 w-40 rounded mt-4"></div>
                <div className="skeleton h-6 w-32 rounded mt-2"></div>
            </div>
        </div>
    );
};

export default HistoryPageSkeleton