import React from 'react'
import { RiPlayList2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const PlaylistVideoCard = ({ playlist }) => {

    return (
        playlist.map((playlist) =>
            <div key={playlist._id} className="card bg-base-100 shadow-md rounded-xl overflow-hidden dark:bg-base-300 hover:bg-base-300">
                <Link to={`/playlist/${playlist._id}`}>
                    <figure className="relative overflow-hidden rounded-xl  aspect-[16/9]">
                        {/* Image */}
                        <video
                            src={playlist.videos[0]?.videofile}
                            alt="Shoes"
                            className="w-full h-auto"
                            poster={playlist.videos[0]?.thumbnail}
                        />
                        {/* Icon */}
                        <div className="absolute bottom-2 right-2  text-white flex items-center gap-1 bg-black/80 bg-opacity-60 p-1 rounded-sm">
                            <RiPlayList2Line className='text-sm w-5' /><p className='text-sm pr-1 text-center '>{playlist?.videoCount}</p>
                        </div>
                    </figure>
                </Link>

                <Link to={`/playlist/${playlist?._id}`}>
                    <div className="card-body p-2">
                        <div>
                            <h2 className="card-title pt-2 line-clamp-1">{playlist?.name}</h2>
                            <div className="flex items-center flex-wrap gap-3 py-1 w-full">
                                <p className="text-xs lg:text-xs text-base-content/60 break-words line-clamp-2">
                                    {playlist?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

        ))
}

export default PlaylistVideoCard