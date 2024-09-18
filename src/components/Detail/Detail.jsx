import React from 'react'
import './Detail.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore()
  const {currentUser} = useUserStore()

  const handleSignOut = ()=> {
      try {
        auth.signOut()
      } catch (error) {
        console.log(error)
      }
    }
  const handleBlock = async ()=>{
    if(!user) return

    const userDocRef = doc(db, 'users', currentUser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"}/>
        <h2>{user?.username}</h2>
        <p>Hi there! I'm Using Chit-Chat</p>
      </div>
      <div className="info">
        <div className="options">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png"/>
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Privacy & Security</span>
            <img src="./arrowUp.png"/>
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png"/>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./lionel-messi-2018-18-1366x768.jpg"/>
                <span>Lionel Messi</span>
              </div>
              <img src="./download.png"/>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png"/>
          </div>
        </div>
        <button onClick={handleBlock}>{isCurrentUserBlocked ? 'You Are Blocked' : isReceiverBlocked ? 'User Blocked' : 'Block User'}</button>
        <button className='logout' onClick={handleSignOut}>Log Out</button>
      </div>
    </div>
  )
}

export default Detail
