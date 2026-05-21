import React from 'react';

const ChannelProfileSkeleton = () => {
    return (
        <div className="w-full h-fit pb-2 skeleton mt-18 bg-base-100 dark:bg-base-200">
            {/* Top Options Dropdown Skeleton */}
            <div className="w-full pr-6 md:pt-5 pt-4 flex justify-end">
                <div className="bg-base-300 rounded-full w-6 h-6 md:w-8 md:h-8"></div>
            </div>

            {/* Profile Section */}
            <div className="flex w-full sm:px-6 px-4 md:px-10 pb-4 gap-4">
                {/* Avatar Skeleton */}
                <div className="flex justify-center items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-base-300"></div>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col justify-between w-full">
                    <div className="md:p-3 p-2 space-y-2">
                        <div className="h-6 md:h-8 bg-base-300 rounded w-2/3"></div>
                        <div className="h-4 bg-base-300 rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-5 p-1 md:p-3">
                        <div className="space-y-1">
                            <div className="h-4 w-10 bg-base-300 rounded"></div>
                            <div className="h-3 w-16 bg-base-300 rounded"></div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-4 w-10 bg-base-300 rounded"></div>
                            <div className="h-3 w-16 bg-base-300 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Subscribe Button */}
                <div className="w-1/3 flex justify-end items-end md:p-4 p-2">
                    <div className="h-10 w-24 bg-base-300 rounded"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex sm:gap-3 md:gap-4 sm:pl-2 md:pl-4 border-t border-t-accent/65 pt-2">
                {['Video', 'Playlist', 'Tweet', 'About'].map((_, i) => (
                    <div key={i} className="btn btn-sm md:btn-md btn-ghost bg-base-300 w-20 h-8"></div>
                ))}
            </div>
        </div>
    );
};

export default ChannelProfileSkeleton;
