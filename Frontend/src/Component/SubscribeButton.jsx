// components/SubscribeButton.jsx
import { useDispatch, useSelector } from "react-redux";
import { setIsSubscribe, SubscribeToggleThunk } from "../store/subscriptionStore.js";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ScreenLoader from "./ScreenLoader.jsx";

const SubscribeButton = ({ channelId, isSubscribe }) => {
    const dispatch = useDispatch();
    const { isSubscribed, isFetchingSubChannels } = useSelector(state => state.subscription);
    const { loggedUser } = useSelector(state => state.authentication);
    // const isSubscribed = subscribedChannels.includes(channel);

    const handleToggleSubscribe = () => {
        dispatch(SubscribeToggleThunk(channelId))
    };
    useEffect(() => {
        dispatch(setIsSubscribe(isSubscribe))
    }, [isSubscribe])
    if (isFetchingSubChannels) {
        return <ScreenLoader/>
    }
    return (
        loggedUser?._id === channelId ? <Link to={'/setting'} className='btn shadow-lg font-bold btn-primary btn-sm md:btn-md'>Manage</Link>
            : <button onClick={handleToggleSubscribe} className={`btn shadow-lg font-bold rounded-full text-white active:bg-accent btn-sm md:btn-md  ${isSubscribed ? 'bg-neutral-800' : 'btn-primary'}`}>
                {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
    );
};

export default SubscribeButton;
