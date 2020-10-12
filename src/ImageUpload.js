import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState('')

    const handleChange = (e) =>{
        
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = (event) =>{
        event.preventDefault()
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        

        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                //progress bar function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error)
            },
            () => {
                //complete function...
                storage.ref("images").child(image.name).getDownloadURL().then(url => {
                    // post image inside of the database
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className='progress__imageupload' value={progress} max="100"></progress>
            <input type='text' placeholder='Enter a caption...' value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type='file' onChange={handleChange} />
            <Button variant='contained' color='default' type='submit' onClick={handleUpload}>Post</Button>
            
        </div>
    )
}

export default ImageUpload
