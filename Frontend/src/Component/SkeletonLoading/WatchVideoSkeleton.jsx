import React from 'react';

const WatchVideoSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 w-full  pt-18 " >

            {/* Left Section: Video Player & Info */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="skeleton w-full aspect-video rounded-lg"></div>

                <div className="skeleton h-6 w-1/2 rounded"></div>
                <div className="flex gap-4 items-center text-sm">
                    <div className="skeleton h-4 w-16 rounded"></div>
                    <div className="skeleton h-4 w-24 rounded"></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-3 items-center">
                        <div className="skeleton w-10 h-10 rounded-full"></div>
                        <div className="flex flex-col gap-1">
                            <div className="skeleton h-4 w-24 rounded"></div>
                            <div className="skeleton h-3 w-16 rounded"></div>
                        </div>
                    </div>
                    <div className="skeleton w-20 h-8 rounded"></div>
                </div>

                <div className="flex gap-4 mt-3">
                    <div className="skeleton w-10 h-10 rounded"></div>
                    <div className="skeleton w-10 h-10 rounded"></div>
                    <div className="skeleton w-20 h-10 rounded"></div>
                </div>
            </div>

            {/* Right Section: Playlist + Related Videos */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                {/* Playlist Videos */}
                <div className="bg-base-200 p-4 rounded-lg">
                    <div className="skeleton h-6 w-3/4 rounded mb-4"></div>
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="skeleton w-24 h-14 rounded-md"></div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="skeleton h-4 w-2/3 rounded"></div>
                                    <div className="skeleton h-3 w-1/3 rounded"></div>
                                </div>
                                <div className="skeleton w-5 h-5 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Videos Section */}
                <div>
                    <div className="skeleton h-6 w-1/3 mb-3 rounded"></div>
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="skeleton w-28 h-16 rounded-md"></div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="skeleton h-4 w-3/4 rounded"></div>
                                    <div className="skeleton h-3 w-1/2 rounded"></div>
                                </div>
                                <div className="skeleton w-5 h-5 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WatchVideoSkeleton;
