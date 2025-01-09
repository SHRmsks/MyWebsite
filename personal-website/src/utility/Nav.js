
"use client";
import React from 'react';
import "../app/global.css";





const Nav = React.memo(({one, two, third}) => {
  const oneName = one.name;
  const twoName = two.name;
  const thirdName = third.name;
  const oneLink = one.link;
  const twoLink = two.link;
  const thirdLink = third.link;

    return (
      
      <div className="w-[40%] flex flex-col justify-around gap-y-2 md-dpr-1:h-[40px] md-dpr-2:h-[30px] md-dpr-3:h-[15px] lg-dpr-1:h-[45px] lg-dpr-2:h-[40px] lg-dpr-3:h-[30px] xl-dpr-1:h-[50px] xl-dpr-2:h-[30px] xl-dpr-3:text-[25px] xxl-dpr-1:h-[60px] xxl-dpr-2:h-[50px] xxl-dpr-3:h-[30px] xxxl-dpr-1:h-[80px] xxxl-dpr-2:h-[60px] xxxl-dpr-3:h-[50px] ">
        <div className="  flex flex-row justify-end items-center">
          <div className=" flex w-[90%] flex-row justify-evenly gap-x-2 py-1">
            <a className="text-center text-nowrap font-cyberpunk text-[15px] text-[#54c1e6]" href={oneLink}>
              {" "}
             {oneName}
            </a>
            <a className="text-center text-nowrap font-cyberpunk text-[15px] text-[#54c1e6]" href={twoLink}>
              {twoName}
            </a>
            <a className="text-center text-nowrap font-cyberpunk text-[15px] text-[#54c1e6]" href ={thirdLink}> 
              {" "}
              {thirdName}
            </a>
          </div>
        </div>
        <div className="border-b-[4px] border-[#54c1e6]"></div>
      </div>
    );
  });
  export default Nav;
  