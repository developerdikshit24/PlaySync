import { FaInstagram, FaFacebook, FaCircleInfo, FaSquareXTwitter } from "react-icons/fa6"
import { FaEye } from "react-icons/fa";
import { FiLink2 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate'
import { formatParagraphs } from '../utils/formatParagraphs';
const ChannelAbout = ({ totalViews, about }) => {
    const formatted = formatParagraphs(about.bio)
    return (
        <div className='w-full h-full flex md:flex-row flex-col gap-4 overflow-hidden'>
            <div className='md:w-11/12 w-full rounded-md bg-base-200 p-4 '>
                <h1 className='text-2xl font-bold py-2'>Bio</h1>
                {formatted.map((p, i) => (
                    <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: p }}
                        className="mb-1"
                    />
                ))}
            </div>
            <div className='md:w-1/2 w-full h-fit rounded-md bg-base-200'>
                <div className='w-full gap-8 flex flex-col p-4'>
                    <h1 className='text-2xl font-bold'>Social Link</h1>
                    <Link to={about?.socialMdiaLink?.Instagram} target='_blank' className='flex w-full gap-2 items-center pl-4'>
                        <FaInstagram className='text-2xl' />
                        <p>Instagram</p>
                    </Link>
                    <Link to={about?.socialMdiaLink?.Facebook} target='_blank' className='flex w-full gap-2 items-center pl-4'>
                        <FaFacebook className='text-2xl' />
                        <p>Facebook</p>
                    </Link>
                    <Link to={about?.socialMdiaLink?.Twetter} target='_blank' className='flex w-full gap-2 items-center pl-4'>
                        <FaSquareXTwitter className='text-2xl' />
                        <p>Twitter</p>
                    </Link>
                    <Link to={'/channel/babe123'} target='_blank' className='flex w-full gap-2 items-center pl-4'>
                        <FiLink2 className='text-2xl' />
                        <p className='link-accent link hover:link-primary link-hover'>http://localhost:5173/channel/babe123</p>
                    </Link>
                </div>
                <div className='flex gap-2 items-center p-4'>
                    <FaEye className='text-2xl' /> Views : {totalViews}
                </div>
                <div className='flex gap-2 items-center p-4'>
                    <FaCircleInfo className='text-2xl' /> Created : {formatDate(about.createdAt || 0)}
                </div>

            </div>
        </div>
    )
}

export default ChannelAbout