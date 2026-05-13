import { createContext, useContext } from "react";
import React from 'react'
import { app } from "./Firebase.js";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"

const FirebaseContext = createContext()

export const useFirebase = () =>{
    return useContext(FirebaseContext)
}

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const FireBaseProvider = ({children}) => {
   const googleAuth = async () => {
     try {
       const result = await signInWithPopup(auth, googleProvider)
       return result
      //  const user = result.user
      //  return {
      //    success: true,
      //    user: {
      //      uid: user.uid,
      //      email: user.email,
      //      name: user.displayName,
      //      photoURL: user.photoURL,
      //      idToken: await user.getIdToken()
      //    }
      //  }
      console.log(result)
     } catch (error) {
       console.error("Google login error:", error)
       return {
         success: false,
         error: error.message
       }
     }
   }

  return (
   <FirebaseContext.Provider value={{googleAuth}}>
    {children}
   </FirebaseContext.Provider>
  )
}

export default FireBaseProvider