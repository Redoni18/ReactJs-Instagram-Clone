import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { Modal, makeStyles, Button, Input,  } from "@material-ui/core"
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle)


  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in
        console.log(authUser)
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })
    return () =>{
      //perform cleanup
      unsubscribe();
    }
  }, [user, username])

  // useEffect runs code based on a dependency
  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //everytime a post is made this code runs
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []); //dependency goes here

  const signUp = (Event) => {
    Event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {return authUser.user.updateProfile({displayName: username})})
    .catch((error) => alert(error.message));
    setOpen(false);
    setUsername('');
    setEmail('')
    setPassword('')
  }

  const signIn = (Event) => {
    Event.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));

    setOpenSignIn(false);
    setUsername('');
    setEmail('')
    setPassword('')
  }

  return (
    <div className="App">

      {/* caption input */}
      {/* file picker */}

      {/* post button */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp"> 
            <center>
              <img alt='Instagram' className='app__modalImage' src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
            </center>
          
            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></Input>
            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
            <Button type='submit' onClick={signUp} variant='contained' color='default'>Sign up</Button>
          </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp"> 
            <center>
              <img alt='Instagram' className='app__modalImage' src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
            </center>
      
            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
            <Button type='submit' onClick={signIn} variant='contained' color='default'>Sign In</Button>
            <small><center>Don't have an account? Sign Up!</center></small>
          </form>
          
        </div>
      </Modal>


      <div className="app__header">
        <img alt='Instagram' className="app__headerImage" src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
        {user ?(
        <Button variant='contained' color='default' onClick={() => auth.signOut()}>Log out</Button>
      ): (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      
      {/* header */}
      {/* posts */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
        
      ): (
        <div></div>
      )}

      <div className="app__posts">
        {user ?(
          <div className="app__postsCenter">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
            ))
          }
          </div>
        ):(
          <div className='app__signinPage'>
              <form className="app__signIn"> 
              <center>
                <img alt='Instagram' className='app__modalImage' src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
              </center>
          
              <center>
                <p>Welcome to Instagram Clone!</p>
                <p>This website only allows you to post pictures and comment on them</p>
                <p>Login or Sign Up if you want to use the website</p>
                <p>P.S <small>If you're Mark Zuckerberg, please dont sue me lol!</small></p>
                <Button variant='contained' onClick={() => setOpenSignIn(true)}>Sign In</Button>
                <Button variant='contained' onClick={() => setOpen(true)}>Sign Up</Button>
              </center>
            </form>

          </div>

        )}
        
      </div>

    </div>
  );
}

export default App;