import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router';
const Protected = ({children}) => {
  
   const{Loading,user}=useAuth();

   if(Loading){
    return (<main><h1>Loading.....</h1></main>)
   }

   if(!user){
    return <Navigate to={'/login'}/>
   }


  return children
}

export default Protected