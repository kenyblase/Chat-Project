import React, { useState } from 'react'
import './Login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../lib/upload'

const Login = () => {
const [addMode, setAddMode] = useState(false)
const [loading, setLoading] = useState(false)
const [avatar, setAvatar] = useState({
    file:null,
    url: ''
})

const handleAvatar = (e)=>{
    if(e.target.files[0]){
        setAvatar({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
    })}}

const handleLogin= async (e)=>{
    e.preventDefault()
    setLoading(true)

const formData = new FormData(e.target)

    const { email, password} = Object.fromEntries(formData)

    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
}

const handleRegister= async (e)=>{
    e.preventDefault()

    setLoading(true)
    
    const formData = new FormData(e.target)

    const {username, email, password} = Object.fromEntries(formData)
try {
    const res = await createUserWithEmailAndPassword(auth, email, password)

    const imgUrl = await upload(avatar.file)

    await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: []
    })
   
    await setDoc(doc(db, 'userchats', res.user.uid), {
        chats:[]
    })

    toast.success('Account Created Successfully! Login to Continue.')
    
} catch (error) {
    console.log(error)
    toast.error(error.message)
}finally{
    setLoading(false)
}
}
  return (
    <div className='body'>
        <div className={addMode ? 'container right-panel-active' : 'container'}>
            <div className="form-container login-container">
                <form onSubmit={handleLogin}>
                    <h1>Log In to Your Chit-Chat Account </h1>
                    <span>Log In Using your Email</span>
                    <input type="text" placeholder='Enter Email' name='email'/>
                    <input type="text" placeholder='Enter Password' name='password'/>
                    <button disabled={loading}>{loading ? 'Loading...' : 'Log In'}</button>
                </form>
            </div>
            <div className="form-container signup-container">
                <form onSubmit={handleRegister}>
                    <h1>Get Started With Us</h1>
                    <span>Create Your Chit-Chat Account</span>
                    <label htmlFor="file">
                        <img htmlFor='file' src={avatar.url || "./avatar.png"}/>
                        <input type="file" id='file' style={{display: 'none'}} onChange={handleAvatar} />
                        Upload an image or Avatar
                    </label>
                    <input type="text" placeholder='Enter Username' name='username'/>
                    <input type="text" placeholder='Enter Email' name='email'/>
                    <input type="password" placeholder='Enter Password' name='password'/>
                    <button disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Already Have an Account?</h1>
                        <p>Login With Your Email to Continue</p>
                        <button className='ghost' onClick={()=> setAddMode(false)}>Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Don't Have an Account?</h1>
                        <p> Register With Your Email to Use Chit-Chat</p>
                        <button className='ghost' onClick={()=> setAddMode(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
