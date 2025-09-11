import React from 'react'
import VerifyForgetPasswordCode from '@/components/auth-section/VerifyForgetPasswordCode'
import { Metadata } from 'next'
import Container from '@/components/shared/Container/Container'

export const metadata: Metadata = {
    title: 'Verify Forget Password',
    description: 'Verify Forget Password',
}

const VerifyForgetPassword = () => {
  return (
     <Container>    
        <VerifyForgetPasswordCode/>
     </Container>
  )
}

export default VerifyForgetPassword