import { IoMdArrowRoundBack } from "react-icons/io";

const TweetSkeleton = () => (
    <div className="w-full skeleton md:w-[600px] bg-base-100 dark:bg-base-200 p-4 rounded-xl shadow-sm ">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-base-300"></div>
            <div className="flex flex-col gap-1">
                <div className="h-4 w-32 bg-base-300 rounded"></div>
                <div className="h-3 w-20 bg-base-300 rounded"></div>
            </div>
        </div>
        <div className="space-y-2 mb-3">
            <div className="h-4 w-3/4 bg-base-300 rounded"></div>
            <div className="h-3 w-full bg-base-300 rounded"></div>
            <div className="h-3 w-5/6 bg-base-300 rounded"></div>
        </div>
        <div className="w-full aspect-video bg-base-300 rounded-xl mb-3"></div>
        <div className="flex items-center justify-between px-4">
            <div className="h-5 w-5 bg-base-300 rounded-full"></div>
            <div className="h-5 w-5 bg-base-300 rounded-full"></div>
            <div className="h-5 w-5 bg-base-300 rounded-full"></div>
        </div>
    </div>
);

const TweetPostFormSkeleton = () => (
    <div className="lg:w-[40%] max-w-md mt-18 m-4 rounded-md bg-base-100 animate-pulse relative overflow-hidden shadow-md skeleton">
        <div className="absolute inset-0 bg-gradient-to-b  from-base-300/40 to-base-100/80 blur-xl scale-125"></div>
        <div className="absolute inset-0 bg-base-200 dark:bg-black/60"></div>
        <div className="relative z-10 p-4 h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col items-center gap-5 w-4/5 m-auto">
                <div className="w-full lg:hidden block">
                    <IoMdArrowRoundBack className="text-2xl text-base-300" />
                </div>
                <div className="avatar">
                    <div className="w-24 rounded-full bg-base-300"></div>
                </div>
                <div className="w-full h-10 rounded-md bg-base-300"></div>
                <div className="w-full h-24 rounded-md bg-base-300"></div>
                <div className="w-full flex justify-between items-center">
                    <div className="h-10 w-40 bg-base-300 rounded-md"></div>
                    <div className="h-20 w-20 bg-base-300 rounded-md"></div>
                </div>
                <div className="w-full h-12 rounded-md bg-base-300"></div>
            </div>
        </div>
    </div>
);

const TweetPageSkeleton = () => {
    return (
        <div className="flex xl:h-full gap-2 justify-center container w-full  overflow-y-hidden" >
            {/* Left: Post Form */}
            <TweetPostFormSkeleton />

            {/* Right: Tweet List */}
            <div className="lg:w-[60%] w-full relative p-3 rounded-md  overflow-y-scroll[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="w-full mt-16 flex gap-2 flex-col">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <TweetSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TweetPageSkeleton;
