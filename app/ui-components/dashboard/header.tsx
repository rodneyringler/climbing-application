'use client'
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './nav-links';

export default function DashboardHeader() {
    return (
    <>
        <div className="fixed left-0 right-0 top-0 md:left-64 h-40 z-10">
            <div className="w-full flex-row items-center justify-center relative h-32">
                <Image src="/pegboard.png" alt="Background image" fill={true} className= "w-full block object-cover rounded-md opacity-90" />
            </div>
            <div className="w-full flex items-center">
                <div className="absolute left-4 bottom-0 z-10">
                    <Image src="/quickdraw.png" alt="left" width={100} height={100} />
                </div>
                <div className="absolute right-4 bottom-0 z-10">
                    <Image src="/quickdraw.png" alt="right" width={100} height={100} />
                </div>
                <h1 className="text-center text-[45px] flex-1 text-2x1 font-bold" >ClimbTrackr</h1> 
            </div>
            

        </div>
    </>
    );
}