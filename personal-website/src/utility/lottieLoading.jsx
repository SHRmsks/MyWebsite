"use client"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loading from "@/asset/loading.json";
import dynamic from "next/dynamic";


export default function Loading(){
    return (
      <div className="flex-1 w-screen h-screen justify-center items-center">
        <Lottie className="w-[300px] h-[300px]" animationData={loading} loop={true} autoPlay={true} />
      </div>
    );
}