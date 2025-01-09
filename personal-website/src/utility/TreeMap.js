"use client";
import {
  Background,
  ReactFlow,
  Controls,
  Handle,
  useEdgesState,
  useNodesState,
  BaseEdge,
  getSmoothStepPath,
} from "@xyflow/react";
import React, { useState, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";

const customNode = ({ data }) => {

  const {onShowSkillTree} = data
  const ClickHandler = (e)=>{
    e.stopPropagation(); 
    if (onShowSkillTree) {onShowSkillTree(data.SkillTreeProps||{})};
  };
  


  return (
    <div
      className="text-center rounded-sm h-fit w-fit cursor-pointer"
      onClick={ClickHandler}
    >
      <Handle
        type="source"
        position="bottom"
        style={{ visibility: "hidden" }}
      />
      <Handle type="target" position="right" style={{ visibility: "hidden" }} />
     
        <>
          <img
            src={data.src}
            className="object-contain max-w-[70px] max-h-[70px] rounded-sm"
          />
          <div className="font-text text-[10px] text-[#00060e]">
            {data.label}
          </div>
        </>
      
    </div>
  );
};

const CustomEdges = ({ sourceX, sourceY, targetX, targetY }) => {
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <defs>
        <radialGradient id="gradient" cx="50%" cy="50%" r="150%">
          <stop offset="0%" style={{ stopColor: "#e6f3f7", stopOpacity: 1 }} />

          <stop
            offset="100%"
            style={{ stopColor: "#38bbeb", stopOpacity: 0 }}
          />
        </radialGradient>

        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="colored"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>
        <BaseEdge
          path={edgePath}
          style={{ stroke: "#54c1e6", strokeWidth: 10 }}
        />
        <path
          d={edgePath}
          stroke="#36576e"
          strokeWidth="4"
          filter="url(#glow)"
          fill="none"
        />
      </g>
      <circle r="6" fill="url(#gradient)" filter="url(#glow)">
        <animateMotion
          dur="3s"
          begin="0s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      <circle r="5" fill="url(#gradient)" filter="url(#glow)">
        <animateMotion
          dur="3s"
          begin="1s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      <circle r="5" fill="url(#gradient)" filter="url(#glow)">
        <animateMotion
          dur="3s"
          begin="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </g>
  );
};
const TreeMap = ({ srcArr, labelArr, props }) => {

  const [selectedSkillTreeProps, setSelectedSkillTreeProps] = useState(null);
  try {
    const rootsrc = srcArr.shift();
    const rootlabel = labelArr.shift();

    let nodes = [
      {
        id: "root",
        type: "img",
        position: { x: 500, y: 200 },
        data: {
          src: rootsrc,
          label: rootlabel,
         
        },
      },
    ];
    let edges = [];

    srcArr.map((val, ind) => {
      const childlabel = labelArr[ind];
      const prop = props[ind+1];
      let xv = 0;
      let yv = 0;
      if ((ind + 1) * 100 <= 1000) {
        xv = (ind + 1) * 100;
        yv = 100;
      } else {
        xv = (ind - 9) * 100;
        yv = 300;
      }
      3;
      nodes.push({
        id: `child${ind}`,
        type: "img",
        position: { x: xv, y: yv },
        data: {
          src: val,
          label: childlabel,
          onShowSkillTree : (props)=> {
            setSelectedSkillTreeProps(props);
          },
          SkillTreeProps: prop
        },
      });
      edges.push({
        id: `r-${ind}`,
        source: "root",
        target: `child${ind}`,
        type: "custom",
        style: { stroke: "#54c1e6", strokeWidth: 5 },
      });
    });

    const nodeTypes = { img: customNode };
    const edgeTypes = { custom: CustomEdges };
    const [Nodes, setNodes, onNodesChange] = useNodesState(nodes);
    const [Edges, setEdges, onEdgesChange] = useEdgesState(edges);
    const closeOverlay = () => setSelectedSkillTreeProps(null);
    return (
      <div className="relative w-full h-full">
      <ReactFlow
        nodes={Nodes}
        edges={Edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      ></ReactFlow>
      {selectedSkillTreeProps && <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40"
          onClick={closeOverlay}>
        <div
            className="relative bg-transparenty p-4 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <SkillTree
              link={selectedSkillTreeProps.link}
              skills={selectedSkillTreeProps.skills}
              framework={selectedSkillTreeProps.framework}
              Icon={selectedSkillTreeProps.Icon}
              intro={selectedSkillTreeProps.intro}
              pjName={selectedSkillTreeProps.pjName}
              local={selectedSkillTreeProps.local}
            />
          </div>
        </div>}
      </div>
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default TreeMap;
