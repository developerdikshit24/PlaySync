// src/components/VideoPlayer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { RiFullscreenExitFill } from "react-icons/ri";
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaExpand,
    FaStepBackward,
    FaStepForward
} from 'react-icons/fa';
import { ImSpinner2 } from "react-icons/im"; // Spinner icon
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const VideoPlayer = ({ src, thumbnail, title = " Video" }) => {
    const videoRef = useRef(null);
    const { selectedVideo } = useSelector(state => state.video);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false); // 🔁 Buffering state

    const togglePlay = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        setIsPlaying(false);
    }, [selectedVideo]);

    const handleProgress = (e) => {
        const newTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = newTime;
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const skipTime = (seconds) => {
        videoRef.current.currentTime += seconds;
    };

    const toggleFullscreen = () => {
        const videoContainer = videoRef.current.parentElement;

        if (document.fullscreenElement) {
            document.exitFullscreen();
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        } else {
            videoContainer.requestFullscreen().then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock("landscape").catch((err) => {
                        toast.warning("Orientation lock failed:", err);
                    });
                }
            });
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    useEffect(() => {
        videoRef.current.volume = volume;
    }, [volume]);

    return (
        <div
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden transition-opacity duration-300"
            onMouseMove={() => {
                setIsHovered(true);
                clearTimeout(window.hoverTimeout);
                window.hoverTimeout = setTimeout(() => {
                    setIsHovered(false);
                }, 900);
            }}
        >
            <video
                ref={videoRef}
                src={src}
                title={title}
                className="w-full h-full object-contain bg-center"
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onWaiting={() => setIsBuffering(true)}   
                onPlaying={() => setIsBuffering(false)}  
                poster={thumbnail}
            />

            {isBuffering && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-30 flex items-center justify-center">
                    <ImSpinner2 className="animate-spin text-white text-4xl" />
                </div>
            )}

           
            <div
                onClick={togglePlay}
                className={`absolute top-0 left-0 w-full h-full bg-black/40 z-10 flex justify-center items-center cursor-pointer transition-opacity duration-500 ${isHovered ? 'opacity-100 visible' : 'opacity-0'
                    }`}
            >
                <button>
                    {isPlaying ? (
                        <FaPause className="md:text-5xl text-white text-2xl" />
                    ) : (
                        <FaPlay className="md:text-5xl text-white text-2xl font-extralight" />
                    )}
                </button>
            </div>

            {/* Controls */}
            <div
                className={`absolute bottom-0 left-0 right-0 z-20 text-white p-2 flex flex-col gap-1 transition-opacity duration-500 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="any"
                    value={progress}
                    onChange={handleProgress}
                    className="w-full accent-purple-700 h-0.5 cursor-pointer mb-2"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => skipTime(-10)}><FaStepBackward className="md:text-2xl" /></button>
                        <button onClick={togglePlay}>
                            {isPlaying ? <FaPause className="md:text-2xl font-extralight" /> : <FaPlay className="md:text-2xl" />}
                        </button>
                        <button onClick={() => skipTime(10)}><FaStepForward className="md:text-2xl" /></button>
                        <span className="md:text-base text-xs">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <button onClick={toggleMute}>
                            {isMuted || volume === 0 ? <FaVolumeMute className="md:text-2xl" /> : <FaVolumeUp className="md:text-2xl" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="md:w-20 w-10 accent-white h-1"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleFullscreen}>
                            {document.fullscreenElement ? <RiFullscreenExitFill className="md:text-2xl" /> : <FaExpand className="md:text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
