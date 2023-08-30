import React, { useEffect } from 'react';
import Icon from './icon';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '@/utils/signInWithGoogle';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { app } from '../../firebase';
import createPlayerIfNotExists from '@/utils/createPlayerIfNotExists';
import updateMaxStreak from '@/utils/updateMaxStreak';
import Link from 'next/link';
import AuthButton from './authButton';
import Image from 'next/image';
import { LogOut, MoveUpRight } from 'lucide-react';

export default function Header({ streakCount }: { streakCount: number }) {
  const auth = getAuth(app);

  const [user, loading, error] = useAuthState(auth);
  const [userData, userDataLoading, userDataError] = useDocument(
    user ? doc(db, 'players', user.uid) : null
  );

  useEffect(() => {
    if (user && !loading) {
      createPlayerIfNotExists(user);
    }
  }, [user, loading]);

  useEffect(() => {
    if (userData) {
      const currentStreak = streakCount;
      const maxStreak = userData.data()?.maxStreak || 0;

      if (currentStreak > maxStreak) {
        // If current streak is higher, update the maximum streak
        updateMaxStreak(currentStreak, user);
      }
    }
  }, [userData, streakCount, user]);

  return (
    <header className='flex mb-8 md:mb-6 items-center flex-row justify-between w-full'>
      <Icon />
      {loading ? (
        <span className='loading loading-dots loading-md'></span>
      ) : user ? (
        <div className='dropdown dropdown-bottom dropdown-end'>
          <label
            tabIndex={0}
            className='btn bg-white hover:bg-slate-50 rounded-md space-x-2 capitalize'
          >
            <Image
              src={user?.photoURL ?? '../../public/profilePicPlaceholder.png'}
              alt='Profile pic'
              width={25}
              height={25}
              className='rounded-md'
            />
            <span>{user.displayName}</span>
            <span className='bg-gray-50 rounded-md px-2 py-1'>
              {streakCount}
            </span>
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content rounded-md capitalize  font-semibold z-[1] menu p-2 shadow bg-base-100 w-52'
          >
            <li>
              <div className='flex flex-row w-full rounded-md hover:bg-gray-50 items-center justify-between'>
                <span>Current Streak</span>
                <span className='bg-gray-50 rounded-md px-2 py-1'>
                  {streakCount}
                </span>
              </div>
            </li>
            <li>
              <div className='flex flex-row items-center w-full rounded-md hover:bg-gray-50 justify-between'>
                <span>Max. Streak</span>
                <span className='bg-gray-50 rounded-md px-2 py-1'>
                  {userData?.data()?.maxStreak}
                </span>
              </div>
            </li>
            <li className='border-b'>
              <div className='flex mb-1 hover:bg-gray-50 flex-row items-center justify-between'>
                <Link
                  href={'/leaderboard'}
                  className='flex items-center justify-between w-full'
                >
                  Leaderboard <MoveUpRight size={18} />
                </Link>
              </div>
            </li>
            <li className='mt-1'>
              <div className='flex items-center hover:bg-red-100 flex-row justify-between w-full'>
                <button onClick={() => signOut(auth)}>Sign Out</button>
                <LogOut size={18} />
              </div>
            </li>
          </ul>
        </div>
      ) : (
        <AuthButton text='Sign In' onClickFunction={() => signInWithGoogle()} />
      )}
    </header>
  );
}
