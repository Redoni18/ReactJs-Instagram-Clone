import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase'
import firebase from 'firebase'
import { Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';

function Post({username, caption, imageUrl, postId, user}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();    
        }
    }, [postId]);

    const postComment = (event) =>{
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Redon" src="/static/images/avatar/1.jpg" />
                <div className="post__headerContent">
                    <h3>{username}</h3>
                </div>
                <div className="post__headerButton">
                    {username === user.displayName &&(<Button startIcon={<DeleteIcon />} variant="contained" onClick={Event => db.collection('posts').doc(postId).delete()}>
                    </Button>
                    )}
                </div>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl}></img>

            {/* username + captions */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            {/* comments */}
            <div className='post__comments'>
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}

            </div>

            {user && (
                <form className="post__commentBox">
                    <input className='post__input' type='text' placeholder='Add a comment...' value={comment} onChange={(e) => setComment(e.target.value)} />
                    <button disabled={!comment} className="post__button" type='submit' onClick={postComment}>Post</button>
                </form>
            )}
            
        </div>
    )
}

export default Post
