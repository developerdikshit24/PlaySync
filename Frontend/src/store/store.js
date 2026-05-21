import { configureStore } from "@reduxjs/toolkit";
import authReduder from './authStore.js'
import videoReducer from './videosStore.js'
import SubscriptionReducer from './subscriptionStore.js'
import LikeReducer from './likeStore.js'
import CommentReducer from './commentStore.js'
import PlayListReducer from './playlistStore.js'
import TweetReducer from './tweetStore.js';
import HistoryReducer from './historyStore.js'
import NotificationReducer from './notification.js';
const store = configureStore({
    reducer: {
        authentication: authReduder,
        video: videoReducer,
        subscription: SubscriptionReducer,
        notification: NotificationReducer,
        like: LikeReducer,
        comment: CommentReducer,
        playlist: PlayListReducer,
        tweet: TweetReducer,
        history: HistoryReducer
    }
})
export default store
