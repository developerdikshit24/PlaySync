import React from 'react';

const VideoSkeleton = () => {
    return (
        Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-full skeleton overflow-hidden">
            <div className="bg-base-200 rounded-xl animate-pulse aspect-video w-full"></div>
            <div className="flex p-4 gap-3">
                <div className="bg-base-200 rounded-full h-10 w-10"></div>
                <div className="flex flex-col  gap-2 w-full">
                    <div className="bg-base-200 h-4 rounded w-3/4"></div>
                    <div className="bg-base-200 h-4 rounded w-1/2"></div>
                </div>
            </div>
        </div>)
    );
};

export default VideoSkeleton;
