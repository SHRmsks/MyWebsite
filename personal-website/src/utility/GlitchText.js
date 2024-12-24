
"use client";
import React from 'react';
import "../app/global.css";
import { motion} from "motion/react";

const GlitchText = ({ text }) => {
const glitchVar = {
    initial: {
        opacity:0.8,
        x:0, 
        y:0,

    },
    glitch: {
        opacity:[0.9, 0.4,0.8, 0.3,1 ],
        x:[0, -5, 4, 6, 0],
        y:[0, -2, 4, 1, 0],
        color: ["rgba(245, 39, 41, 0.8)", "rgba(96, 241, 61, 0.8)","#39c4b6" ],
       transition: {
        repeat: Infinity,
        repeatDelay: 0.1,
        ease: "easeInOut",
        duration: 1,
        repeat:2,
    },
       
    }
    
};
const flickerVar = {
    initial: {
       opacity:1,
    },
    flicker:{
        opacity:[1, 0.5, 1],
        color: ["rgba(245, 39, 41, 1)", "rgba(96, 241, 61, 1)","#39c4b6" ],
       transition: {repeatDelay: 0.05,
        ease: "easeInOut",
        duration: 0.2,}
        
    }
}

return (
       
        
        <motion.div 
        className="absolute w-[100%] h-[100%] text-center font-medium font-text text-[#39c4b6] text-[12px]"
        variants={glitchVar}
        initial="initial"
        animate="glitch"
        >
            {text}
        </motion.div>
        
        
      




);





}
export default GlitchText;