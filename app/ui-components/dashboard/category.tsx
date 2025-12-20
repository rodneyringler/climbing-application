'use client'
import Image from 'next/image';

export default function CategoryWrapper() {
    return (
        <>
            <div className="w-full flex-row items-center justify-center relative h-32">
                <Image src="/pegboard.png" alt="Background image" fill={true} className= "w-full block object-cover rounded-md opacity-90" />
            </div>
        </>
    )
}

export function Category() {
    
    return (
        <>
            <div className="display-flex justify-around gap-10px">
                <div className="flex-1 padding-20px border-2 border-gray-300 rounded-md"></div>
            </div>
        </>
    );
}