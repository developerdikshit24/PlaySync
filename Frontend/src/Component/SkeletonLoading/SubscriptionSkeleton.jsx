import React from 'react';
import VideoSkeleton from './VideoSkeleton.jsx'
const SubscriptionSkeleton = () => {
    return (
        <div className="w-full h-full p-6 ">
            {/* Search and Header */}
            <div className="w-full flex justify-between items-center mb-6">
                <div className="skeleton h-10 w-48 rounded"></div>
                <div className="flex gap-4">
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                </div>
            </div>

            {/* Channels */}
            <h1 className="text-xl font-bold mb-3">Channels (1)</h1>
            <div className="flex gap-4 mb-6">
                <div className="skeleton w-16 h-16 rounded-full ring-2 ring-primary ring-offset-2"></div>
            </div>

            {/* Videos */}
            <h1 className="text-xl font-bold mb-3">Videos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ">
                <VideoSkeleton />
            </div>
        </div>
    );
};

export default SubscriptionSkeleton;
