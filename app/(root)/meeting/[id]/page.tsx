  "use client"
  import MeetingRoom from '@/components/MeetingRoom'
  import MeetingSetup from '@/components/MeetingSetup'
  import { useGetCallByID } from '@/hooks/useGetCallById'
  import { useUser } from '@clerk/nextjs'
  import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
  import { Loader } from 'lucide-react' 
  import React, { useState } from 'react'
  import { useParams } from 'next/navigation'
  const Meeting = () => {
    const {user,isLoaded} = useUser()
    const { id } = useParams();
    const [isSetupComplete, setIsSetupComplete] = useState(false)
    const {call,isCallLoading} = useGetCallByID(id)
    if(!isLoaded || isCallLoading) return <Loader/>
    return (
      <main className='h-screen w-full'>
  <StreamCall call={call}>
    <StreamTheme>
      {!isSetupComplete?(
        <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
      ):<MeetingRoom/>}
    </StreamTheme>
  </StreamCall>
      </main>
    )
  }

  export default Meeting