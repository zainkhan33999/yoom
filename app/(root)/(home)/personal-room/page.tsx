"use client"
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { Button } from '@/components/ui/button';
import {toast} from "sonner"
import { useGetCallById } from '@/hooks/useGetCallById';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
const Table =({title,description}:{title:string;description:string})=>(
  <div className='flex flex-col items-start gap-2 xl:flex-row'>
    <h1 className='text-base font-medium text-sky1 lg:text-xl xl:min-w-32'>{title}</h1>
    <h1 className='truncate test-sm font-bold max-sm:max-w-[320px]'>{description}</h1>
  </div>
)

const PersonalRoom = () => {
  const client = useStreamVideoClient()
  const router = useRouter()
  const {user} = useUser()
  const meetingId = user?.id
const meetingLink = `/meeting/${meetingId}`;
  
  console.log(user)
  const {call} = useGetCallById(meetingId!)
  const startRoom = async() =>{
    if(!client||!user) return
    const newCall = client.call('default',meetingId!)
    if(!call){
      await newCall.getOrCreate({
        data:{
          starts_at:new Date().toISOString(),
         
        }
      })
    }
    router.push(`/meeting/${meetingId}`)
  }
  return (
    <section className="flex size-full flex-col gap-10 text-white">
    <h1 className="text-3xl font-bolds">Personal Room</h1>
    <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
<Table title = "Topic" description={`${user?.username}'s Meeting Room`}/>
<Table title = "Meeting ID" description={meetingId!}/>
<Table title = "Invite Link" description={meetingLink}/>
    </div>
    <div className='flex gap-5'>
<Button className ="bg-blue1" onClick={startRoom}>
  Start Meeting
</Button>
<Button className ="bg-dark3" onClick={()=>{
  navigator.clipboard.writeText(meetingLink)

  toast("Meeting created successfully!")
}}>
 Copy Invitation
</Button> 
    </div>
   </section>
  )
}

export default PersonalRoom