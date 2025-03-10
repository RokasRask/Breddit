import { useState } from 'react';
import { serverUrl } from '../Constants/main';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function useComments() {

    const [comments, setComments] = useState([]);
    /* 
    [
        {id: 1, postId: 1, comId: null, body: 'comment body', author: 'author name', likes:{l:[],d:[]}},
        {id: 2, postId: 1, comId: 2, body: 'comment body', author: 'author name', likes:{l:[],d:[]}},
        {id: 3, postId: 1, comId: 3, body: 'comment body', author: 'author name', likes:{l:[],d:[]}},
    ];
    */

    const upVoteComment = async (comId, user) => {
        if (user.role === 'guest') {
            return;
        }

        setComments(coms => {

            const { likes } = coms.find(c => c.id === comId);

            const l = new Set(likes.l);
            const d = new Set(likes.d);
            const id = user.id;

            d.delete(id);
            if (l.has(id)) {
                l.delete(id);
            } else {
                l.add(id);
            }
            const newLikes = {};
            newLikes.l = [...l];
            newLikes.d = [...d];

            return coms.map(c => c.id === comId ? { ...c, likes: newLikes } : c);

        });
    }

    const downVoteComment = (comId, user) => {
        if (user.role === 'guest') {
            return;
        }

        setComments(coms => {

            const { likes } = coms.find(c => c.id === comId);

            const l = new Set(likes.l);
            const d = new Set(likes.d);
            const id = user.id;

            l.delete(id);
            if (d.has(id)) {
                d.delete(id);
            } else {
                d.add(id);
            }

            const newLikes = {};
            newLikes.l = [...l];
            newLikes.d = [...d];

            return coms.map(c => c.id === comId ? { ...c, likes: newLikes } : c);

        });
    }

    const addNewCommentComment = async (comId, commentText, user) => {
        setComments(c => [{
            id: uuidv4(),
            comId,
            postId: null,
            body: commentText,
            author: user.name,
            likes: { l: [], d: [] }
        }, ...c]);
        try {
            await axios.post(serverUrl + 'create-comment/' + comId + '/com', {
                author_id: user.id,
                content: commentText
            });

        } catch (error) {
            console.error(error);
        }
    }


    const addNewPostComment = async (postId, commentText, user) => {
        setComments(c => [...c, {
            id: uuidv4(),
            postId,
            comId: null,
            body: commentText,
            author: user.name,
            likes: { l: [], d: [] }
        }]);
        try {
            await axios.post(serverUrl + 'create-comment/' + postId + '/post', {
                author_id: user.id,
                content: commentText
            });

        } catch (error) {
            console.error(error);
        }
    }


    const getComments = async (id, type) => {
        try {
            const response = await axios.get(serverUrl + 'comments/' + id + '/' + type);
            console.log('Ateina atsakymas iš serverio į useComments:', response.data);
            setComments(comments => {
                const c = structuredClone(comments);
                response.data.forEach(res => {
                    const copy = c.find(c => c.id === res.id);
                    if (copy) {
                        copy.body = res.body;
                    } else {
                        c.push(res);
                    }
                });
                return c;
            });
        } catch (error) {
            console.error(error);
        }
    }

    return { comments, getComments, addNewPostComment, upVoteComment, downVoteComment, addNewCommentComment };
}