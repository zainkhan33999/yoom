'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from '../components/ui/HomeCard';
import MeetingModal from '../components/ui/MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from '../components/ui/Loader';

import ReactDatePicker from 'react-datepicker';
import { toast } from "sonner";
import { Input } from './ui/input';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

// Function to get a fresh JWT token from your server
const getToken = async (userId: string) => {
  const res = await fetch(`/api/token?userId=${userId}`);
  const data = await res.json();
  return data.token;
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [isClientReady, setIsClientReady] = useState(false);

  // Connect the user to Stream Video when client and user are ready
  useEffect(() => {
    if (!client || !user) return;

    const connectUser = async () => {
      try {
        const token = await getToken(user.id);
        await client.connectUser(
  { id: user.id, name: user.username ?? 'User' }, // fallback to 'User'
  token
);
        setIsClientReady(true);

      } catch (error) {
        console.error('Failed to connect user to Stream Video:', error);
        toast.error('Failed to connect video service. Please refresh the page.');
      }
    };

    connectUser();
  }, [client, user]);

  const createMeeting = async () => {
    console.log('createMeeting triggered', { values, client, user });

    if (!client || !user) {
      toast.error('Please wait while we initialize the video service');
      return;
    }

    try {
      if (!values.dateTime) {
        toast('Please select a date and time');
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) {
        throw new Error('Failed to initialize call');
      }

      const startsAt = values.dateTime.toISOString();
      const description = values.description || 'Instant Meeting';

      // Wrap getOrCreate with timeout
      const result = await Promise.race([
        call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: { description },
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout. Please check your network.')), 30000)
        ),
      ]);

      console.log('Meeting successfully created:', result);

      setCallDetail(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast.success('Meeting created successfully!');
    } catch (error) {
      console.error('Meeting creation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create meeting');
      if (error instanceof Error && error.message.includes('Connection timeout')) {
        setMeetingState(undefined);
      }
    }
  };

  if (!client || !user || !isClientReady) {
    console.log('Client or user not ready - showing loader');
    return <Loader />;
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${callDetail?.id}`;
  console.log('Generated meeting link:', meetingLink);


        return (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
            className='bg-orange1'
              img="/icons/add-meeting.svg"
              title="New Meeting"
              description="Start an instant meeting"
              handleClick={() => setMeetingState('isInstantMeeting')}
            />
            <HomeCard
              img="/icons/join-meeting.svg"
              title="Join Meeting"
              description="via invitation link"
              className="bg-blue1"
              handleClick={() => setMeetingState('isJoiningMeeting')}
            />
            <HomeCard
              img="/icons/schedule.svg"
              title="Schedule Meeting"
              description="Plan your meeting"
              className="bg-purple1"
              handleClick={() => setMeetingState('isScheduleMeeting')}
            />
            <HomeCard
              img="/icons/recordings.svg"
              title="View Recordings"
              description="Meeting Recordings"
              className="bg-yellow1"
              handleClick={() => router.push('/recordings')}
            />

            {!callDetail ? (
              <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Create Meeting"
                handleClick={createMeeting}
              >
                <div className="flex flex-col gap-2.5">
                  <label className="text-base font-normal leading-[22.4px] text-sky-2">
                    Add a description
                  </label>
                  <textarea
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex w-full flex-col gap-2.5">
                  <label className="text-base font-normal leading-[22.4px] text-sky-2">
                    Select Date and Time
                  </label>
                  <ReactDatePicker
                    selected={values.dateTime}
                    onChange={(date) => setValues({ ...values, dateTime: date! })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                  />
                </div>
              </MeetingModal>
            ) : (
              <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Meeting Created"
                handleClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  toast( ' Please select a date and time' );
                }}
                image={'/icons/checked.svg'}
                buttonIcon="/icons/copy.svg"
                className="text-center"
                buttonText="Copy Meeting Link"
              />
            )}

            <MeetingModal
              isOpen={meetingState === 'isJoiningMeeting'}
              onClose={() => setMeetingState(undefined)}
              title="Type the link here"
              className="text-center"
              buttonText="Join Meeting"
              handleClick={() => router.push(values.link)}
            >
              <Input
                placeholder="Meeting link"
                onChange={(e) => setValues({ ...values, link: e.target.value })}
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </MeetingModal>

            <MeetingModal
              isOpen={meetingState === 'isInstantMeeting'}
              onClose={() => setMeetingState(undefined)}
              title="Start an Instant Meeting"
              className="text-center"
              buttonText="Start Meeting"
              handleClick={createMeeting}
            />
          </section>
        );
      };

      export default MeetingTypeList;
