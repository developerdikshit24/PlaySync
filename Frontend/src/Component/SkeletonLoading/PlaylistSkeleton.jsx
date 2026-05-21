import React from 'react';

const PlaylistSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
            {/* Left: Playlist Info */}
            <div className="w-full lg:w-1/3 h-full rounded-md bg-base-200 p-4 flex flex-col gap-4">
                <div className="skeleton w-full aspect-video rounded-md"></div>

                <div className="flex items-center h-52 gap-3">
                    <div className="skeleton w-10 h-10  rounded-full"></div>
                    <div className="flex-1">
                        <div className="skeleton h-4 w-3/4 rounded"></div>
                        <div className="skeleton h-3 w-1/2 rounded mt-1"></div>
                    </div>
                </div>

                <div className="skeleton h-5 w-2/3 rounded mt-2"></div>
                <div className="skeleton h-3 w-1/2 rounded"></div>

                <div className="flex justify-between mt-auto pt-4 text-xs">
                    <div className="skeleton h-3 w-16 rounded"></div>
                    <div className="skeleton h-3 w-24 rounded"></div>
                </div>
            </div>

            {/* Right: Video List */}
            <div className="w-full lg:w-2/3 bg-base-200 rounded-md p-4 flex flex-col gap-4">
                <div className="skeleton h-6 w-1/2 rounded mb-2"></div>

                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="skeleton w-28 h-16 sm:h-20 md:h-24 rounded-md"></div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="skeleton h-4 w-3/4 rounded"></div>
                            <div className="skeleton h-3 w-1/2 rounded"></div>
                            <div className="skeleton h-3 w-1/3 rounded"></div>
                        </div>
                        <div className="skeleton w-6 h-6 rounded-full ml-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistSkeleton;
