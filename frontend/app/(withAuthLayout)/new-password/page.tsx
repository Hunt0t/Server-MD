import NewPassword from '@/components/auth-section/NewPassword';
import React from 'react'
 
export const metadata = {
    title: "New Password - My Website",
    description: "Change your account password securely on My Website.",
  };


const ChangePasswordPage = () => {
  return (
    <div>
        <NewPassword/>
    </div>
  )
}

export default ChangePasswordPage