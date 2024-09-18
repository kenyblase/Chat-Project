import React, { useEffect } from 'react'
import List from './components/List/List'
import Chat from './components/Chat/Chats'
import Detail from './components/Detail/Detail'
import Login from './components/Login/Login'
import Notification from './components/Notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'


function App() {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user === null){
        fetchUserInfo(user)}
        else{
          fetchUserInfo(user.uid)
        }
    })

    return()=> {
      unsub()
    }
  }, [fetchUserInfo]) 

  if(isLoading) return <div className='loading'>Loading...</div>
  return (
    <>
    {currentUser && (
    <div className='container'>
        <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
        </>
    </div>
      ) }
       {currentUser === null &&(<Login/>)}
    <Notification/>
    </>
  )
}

export default App
App