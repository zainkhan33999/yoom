"use client"

import React, { useState } from 'react'
import HomeCard from './ui/HomeCard'
import { Call } from '@stream-io/video-react-sdk'
import MeetingModal from './ui/MeetingModal'
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import ReactDatePicker from "react-datepicker"
import { toast } from "sonner"
import { Input } from "../components/ui/input"
const MeetingTypeList = () => {

  const router = useRouter()
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting'|'isJoiningMeeting'|'isInstantMeeting'|undefined>()
  const {user} = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime:new Date(),
    description:'',
    link:"",
  })
  const [callDetails, setCallDetails] = useState<Call>()
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  const createMeeting = async()=>{
if(!client || !user) return
try {
  const id = crypto.randomUUID()
  const call = client.call("default",id)
  if(!call) throw new Error("Failed to make a call")
    const startsAt = values.dateTime.toISOString()||
  new Date(Date.now()).toISOString()
  const description = values.description || "Instant meeting"
  console.log("Client:", client)
console.log("User:", user)
console.log("Call ID:", id)
  await call.getOrCreate({
    data:{
      starts_at:startsAt,
      custom:{
        description
      }
    }
  })
  setCallDetails (call)
  if(!values.description){
    router.push(`/meeting/${call.id}`)
    console.log("value",values)
  }
} catch (error) {
  console.log(error)
}
  }
  return (
   <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
<HomeCard
img="icons/add-meeting.svg"
title="New Meeting"
description="Start an instant meeting"
handleClick ={()=>setMeetingState('isInstantMeeting')}
className="bg-orange1"/>

<HomeCard
img="icons/schedule.svg"
title="Schedule Meeting"
description="Plan your meeting"
handleClick ={()=>setMeetingState('isScheduleMeeting')}
className="bg-blue1"/>

<HomeCard
img="icons/recordings.svg"
title="View Recordings"
description="Check out your recordings"
handleClick ={()=>router.push('/recordings')}
className="bg-purple1"/>
<HomeCard
img="icons/join-meeting.svg"
title="Join Meeting"
description="via inviatation link "
handleClick ={()=>setMeetingState("isJoiningMeeting")}
className="bg-yellow1"/>
{!callDetails?(
  <MeetingModal
  isOpen={meetingState==='isScheduleMeeting'}
  onClose={()=>setMeetingState(undefined)}
  title="Create Meeting"
  handleClick={createMeeting}>
  <div className="flex flex-col gap-2.5 ">
    <label className='text-base text-normal leading-[22px] text-sky2 '>Add a Description</label>
   <textarea className='border-none bg-dark2 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{
    setValues({...values,description:  e.target.value})
   }}/>
  </div>
  <div className='flex w-full flex-col gap-2.5'>
  <label className='text-base text-normal leading-[22px] text-sky2 '>Select Date and Time</label>
  <ReactDatePicker
  selected={values.dateTime}
  onChange={(date)=>setValues({...values,dateTime:date!})}
  showTimeSelect
  timeFormat='HH:mm'
  timeIntervals={15}
  timeCaption='time'
  dateFormat="MMMM d ,yyyy h:mm aa"
  className='w-full rounded bg-dark2 p-2 focus:outline-none'/>
  </div>
    </MeetingModal>
):(
  <MeetingModal
isOpen={meetingState==='isScheduleMeeting'}
onClose={()=>setMeetingState(undefined)}
title="Meeting Created"
className="text-center"
handleClick={()=>{
  navigator.clipboard.writeText(meetingLink)

  toast("Meeting created successfully!")
}}
image='/icons/checked.svg'
buttonIcon='/icons/copy.svg'
buttonText="Copy Meeting Link"/>
)}
<MeetingModal
isOpen={meetingState==="isInstantMeeting"}
onClose={()=>setMeetingState(undefined)}
title="Start an instant meeting"
className="text-center"
buttonText="Start Meeting"
handleClick={createMeeting}/>

<MeetingModal
isOpen={meetingState==="isJoiningMeeting"}
onClose={()=>setMeetingState(undefined)}
title="Type the link here"
className="text-center"
buttonText="Start Meeting"
handleClick={()=>router.push(values.link)}>
  <Input placeholder='Meeting Link'/>
</MeetingModal>
   </section>
  )
}

export default MeetingTypeList

