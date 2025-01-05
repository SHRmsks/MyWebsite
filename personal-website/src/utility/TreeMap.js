import { Background, ReactFlow, Controls, Handle } from "@xyflow/react";
import React, { useState, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";

const customNode = ({ data }) => {
  console.log(data.src);
  return (
    <div className="text-center rounded-sm h-fit w-fit cursor-pointer">
      <Handle type="source" position="right" style={{ visibility: "hidden" }} />
      <Handle type="target" position="left" style={{ visibility: "hidden" }} />
      <img
        src={data.src}
        className="object-contain max-w-[70px] max-h-[70px] rounded-sm"
      />
      <div className="font-text text-[10px] text-[#00060e]">{data.label}</div>
    </div>
  );
};
const TreeMap = () => {
  const nodes = [
    {
      id: "root",
      type: "img",
      position: { x: 0, y: 0 },
      data: {
        src: "/react.svg",
        label: "Skill Set",
      },
    },
    {
      id: "child1",
      type: "img",
      position: { x: 500, y: 50 },
      data: {
        src: "/react.svg",
        label: "Skill Sets",
      },
    },
  ];
  const edges = [
    {
      id: "r-1",
      source: "root",
      target: "child1",
      style: { stroke: "#54c1e6", strokeWidth: 5},
    },
  ];

  const nodeTypes = { img: customNode };
  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
      
    </ReactFlow>
  );
};

export default TreeMap;
