import { useReducer } from 'react';
import postsReducer from '../Reducers/postsReducer';
 
export default function usePosts() {
 
    const [posts, dispachPosts] = useReducer(postsReducer, null);
   
   
    return { posts };
 
}