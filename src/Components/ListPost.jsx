import { useContext, useEffect } from 'react';
import DataContext from '../Contexts/Data';
import ListComment from './ListComment';
import AuthContext from '../Contexts/Auth';
import * as C from '../Constants/actions';

export default function ListPost({post}) {

    const {comments, getComments, dispachPosts} = useContext(DataContext);

    const { user } = useContext(AuthContext);

    useEffect(_ => {

        console.log('pakito', post.id)

    }, [post])

    const upVote = _ => {
        const ao = {
            type: C.UPVOTE_POST,
            postId: post.id,
            user
        };
        dispachPosts(ao);
    };
    const downVote = _ => {
        const ao = {
            type: C.DOWNVOTE_POST,
            postId: post.id,
            user
        };
        dispachPosts(ao);
    };

    return (
        <div className="post">
            <div className="post-top">
                <span className="author"><img src={post.avatar} alt="avatar" style={{width: '30px'}} /></span>
                <span className="date">{new Date(post.date).toLocaleDateString('lt-LT')}</span>
            </div>
            <h2>{post.title}</h2>
            <div className="post-image">
                <img src={post.image_url} alt={post.title} />
            </div>
            <p>{post.content}</p>
            <div className="post-bottom">
                <span className="likes">
                    <i className="up" onClick={upVote}>⇧</i>
                        {post.likes.l.length - post.likes.d.length}
                    <i className="down" onClick={downVote}>⇩</i>
                </span>
                <span className="comment" onClick={_ => getComments(post.id, 'post')}>Comments: {post.comments}</span>
            </div>
            <div className="post-comments">
                <h3>Comments</h3>
                
                    {
                        comments
                        .filter(comment => comment.postId === post.id && comment.comId === null)
                        .map(comment => <ListComment key={comment.id} comment={comment} />)
                    }

            </div>
        </div>
    );

}