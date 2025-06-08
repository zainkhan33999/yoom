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
  const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
  
  console.log('[PersonalRoom] Component rendered', {
    user,
    meetingId,
    meetingLink,
    clientInitialized: !!client
  });

  const {call} = useGetCallById(meetingId!)
  console.log('[PersonalRoom] Current call status:', call);

  const startRoom = async() => {
    console.group('[startRoom] Function execution started');
    try {
      console.log('[startRoom] Checking client and user');
      if(!client) {
        console.error('[startRoom] Stream client not initialized');
        toast.error('Video client not ready');
        return;
      }
      
      if(!user) {
        console.error('[startRoom] User not authenticated');
        toast.error('Please sign in first');
        return;
      }

      console.log('[startRoom] Creating call with meetingId:', meetingId);
      const newCall = client.call('default', meetingId!);
      
      if(!call) {
        console.log('[startRoom] No existing call found, creating new one');
        try {
          const createdCall = await newCall.getOrCreate({
            data: {
              starts_at: new Date().toISOString(),
            }
          });
          console.log('[startRoom] Call created successfully:', createdCall);
          toast.success('Meeting room created');
        } catch (createError) {
          console.error('[startRoom] Error creating call:', createError);
          toast.error('Failed to create meeting room');
          throw createError;
        }
      } else {
        console.log('[startRoom] Existing call found:', call);
      }

      console.log('[startRoom] Navigating to meeting:', `/meeting/${meetingId}`);
      router.push(`/meeting/${meetingId}`);
    } catch (error) {
      console.error('[startRoom] Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      console.groupEnd();
    }
  }

  const copyInvitation = () => {
    console.log('[copyInvitation] Copying meeting link:', meetingLink);
    try {
      navigator.clipboard.writeText(meetingLink);
      toast.success('Meeting link copied to clipboard!');
      console.log('[copyInvitation] Link copied successfully');
    } catch (error) {
      console.error('[copyInvitation] Failed to copy link:', error);
      toast.error('Failed to copy meeting link');
    }
  }

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bolds">Personal Room</h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title="Topic" description={`${user?.username}'s Meeting Room`}/>
        <Table title="Meeting ID" description={meetingId!}/>
        <Table title="Invite Link" description={meetingLink}/>
      </div>
      <div className='flex gap-5'>
        <Button className="bg-blue1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button className="bg-dark3" onClick={copyInvitation}>
          Copy Invitation
        </Button> 
      </div>
    </section>
  )
}

export default PersonalRoom