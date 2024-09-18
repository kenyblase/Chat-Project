import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import EmojiPicker from 'emoji-picker-react'
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from 'firebase/firestore'
import {db} from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/upload'

const Chat = () => {
  const [chat, setChat] = useState()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [img, setImg] = useState({
    file:null,
    url: ''
  })

  const {currentUser} = useUserStore()
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore()

  const endRef = useRef(null)

  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [])

  useEffect(()=> {
    const unsub = onSnapshot(doc(db, 'chats', chatId), (res)=>{
      setChat(res.data())
    })

    return () => {
      unsub()
    }
  }, [chatId])

  const handleEmoji = (e)=>{
    setText(prev=>prev+e.emoji)
  }

  const handleImg = (e)=>{
    if(e.target.files[0]){
        setImg({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
    })}}

  const handleSend = async ()=>{
    if(text === '') return

    let imgUrl = null

    try {
      if(img.file){
        imgUrl = await upload(img.file)
      }

      await updateDoc(doc(db, 'chats', chatId), {
        messages:arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date,
          ...(imgUrl && {img:imgUrl})
        })
      })

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async (id) => {
      const userChatsRef = doc(db, 'userchats',id)
      const userChatsSnapshot = await getDoc(userChatsRef)

      if (userChatsSnapshot.exists()){
        const userChatsData = userChatsSnapshot.data()

        const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)

        userChatsData.chats[chatIndex].lastMessage = text
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
        userChatsData.chats[chatIndex].updatedAt = Date.now()

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        })
      }
  })
    } catch (error) {
      console.log(error)
    }

    setImg({
      file:null,
      url:''
    })

    setText('')
  }
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"}/>
          <div className="texts">
            <span>{user?.username}</span>
            <p>Hi there! I'm Using Chit-Chat</p>
          </div>
        </div>
        <div className="icons">
          <img src="phone.png"/>
          <img src="video.png"/>
          <img src="info.png"/>
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map(message=>(
        <div className={message.senderId === currentUser.id ? "message own" : 'message'} key={message?.createdAt}>
          <div className="texts">
            {message.img && <img src={message.img}/>}
            <p>{message.text}</p>
            <span>1 min ago</span>
          </div>
        </div>
        ))}
        {img.url && (<div className="message own">
          <div className="texts">
            <img src={img.url}/>
          </div>
        </div>)}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file"><img src="./img.png"/></label>
          <input type="file" id='file' style={{display:'none'}} onChange={handleImg}/>
          <img src="./camera.png"/>
          <img src="./mic.png"/>
        </div>
        <input type="text" 
        value={text}
        placeholder={(isCurrentUserBlocked || isReceiverBlocked)?'You Cannot Chat With This User' : 'Type Message'}
        onChange={(e)=> setText(e.target.value)}
        disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <img src="./emoji.png" onClick={()=> setOpen(prev => !prev)}/>
          <div className="picker"> 
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat
