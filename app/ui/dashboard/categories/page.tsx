'use client';
import Image from "next/image"



export default function () {
  // Your code here
  return (
    <div>
        <h1> Workshop </h1>

    <div>Column 1
        <Image src="/power.jpg" alt="Strength and Power" height={77} width={90}></Image>
    </div>
    <div>Column 2
        <Image src="/public/endurance.jpg" alt="Endurance" height={40} width={40}></Image>
    </div>
    <div>Column 3
        <Image src="/public/mobility.jpg" alt="Mobility" height={40} width={40}></Image>
    </div>
    <div>Column 4
        <Image src="/conditioning.jpg" alt="Conditioning" height={40} width={40}></Image>
    </div>
    <div>Column 5
        <Image src="/technique.jpg" alt="Technique" height={40} width={40}></Image>
    </div>


    </div>
  )
}


