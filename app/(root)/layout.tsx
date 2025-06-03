import React, { ReactNode } from 'react'
import "@stream-io/video-react-sdk/dist/css/styles.css";
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
        {children}
    </main>
  )
}

export default RootLayout