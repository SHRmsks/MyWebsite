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
import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";

const customNode = ({ data }) => {
  // console.log("customNode", data);
  const { onShowSkillTree } = data;
  const ClickHandler = (e) => {
    e.stopPropagation();
    if (onShowSkillTree) {
      onShowSkillTree(data.SkillTreeProps || {});
    }
  };

  return (
    <div
      className="text-center rounded-sm h-fit w-fit cursor-pointer hover:scale-[1.2] ease-in-out duration-200"
      onClick={ClickHandler}
    >
      <Handle
        type="source"
        position="bottom"
        style={{ visibility: "hidden" }}
      />
      {data.pos && data.pos == "left" ? (
        <Handle
          type="target"
          position="left"
          style={{ visibility: "hidden" }}
        />
      ) : (
        <Handle
          type="target"
          position="right"
          style={{ visibility: "hidden" }}
        />
      )}

      <>
        <img
          src={data.src}
          className="object-contain max-w-[70px] max-h-[70px] rounded-sm"
        />
        <div className="font-text text-[10px] text-[#dff5ee] text-shadow-xs">
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
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#e6f3f7", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#b8e4f5", stopOpacity: 0 }}
          />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="colored" />
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- STATIC BACKGROUND RAILS (Your original paths are good for context) --- */}
      <g>
        <BaseEdge
          path={edgePath}
          style={{ stroke: "#dead26", strokeWidth: 10 }}
        />
        <path
          d={edgePath}
          stroke="#36576e"
          strokeWidth="4"
          strokeDasharray="10,2,2 , 4"
          fill="none"
        />
        <path
          d={edgePath}
          stroke="#36576e"
          strokeWidth="1"
          strokeDasharray="6,7,3,1"
          fill="none"
        />
      </g>
      <g filter="url(#glow)">
        <path
          d={edgePath}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="5"
          strokeDasharray="60 1000"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="660"
            to="-1000"
            dur="2s"
            begin="0s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d={edgePath}
          fill="none"
          stroke="#e6f3f7"
          strokeWidth="6"
          strokeDasharray="10 1000"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="610"
            to="-1000"
            dur="2s"
            begin="0s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  );
};
const TreeMap = ({ srcArr, labelArr, props }) => {
  const [selectedSkillTreeProps, setSelectedSkillTreeProps] = useState(null);
  const nodeRef = new useRef(null);
  const [Nodes, setNodes, onNodesChange] = useNodesState([]);
  const [Edges, setEdges, onEdgesChange] = useEdgesState([]);
  try {
    let edges = [];
    useEffect(() => {
      if (nodeRef.current) {
        const { offsetWidth, offsetHeight } = nodeRef.current;

        const distancex = offsetWidth / 2 - 10;
        const distancey = offsetHeight / 2 - 10; //root
        let number = srcArr.length - 1; // total nodes

        let distanceX = offsetWidth / (srcArr.length - 2) - 100 * number; // single row
        let distanceY = offsetHeight / 4 - 10;
        let pos = "right";

        if (srcArr.length > 4) {
          number = Math.ceil((srcArr.length - 1) / 2);
          distanceX = offsetWidth / (srcArr.length - 2) - 100 * number;
        }

        let nodes = [
          {
            id: "root",
            type: "img",
            position: { x: distancex, y: distancey },
            data: {
              src: srcArr[0],
              label: labelArr[0],
              textColor: "#ffffff",
            },
          },
        ];
        console.log("srcArr", srcArr);
        srcArr.slice(1).forEach((val, ind) => {
          const childlabel = labelArr[ind + 1];
          const prop = props[ind + 1];
          let xv = 0;
          let yv = 0;
          if (ind + 1 <= number) {
            xv = ind * distanceX;
            yv = distanceY;
          } else {
            xv = (ind - number) * distanceX;
            yv = distanceY + distancey;
          }
          if (xv > distancex / 2) pos = "left";
          console.log(ind, xv);
          nodes.push({
            id: `child${ind}`,
            type: "img",
            position: { x: xv, y: yv },
            data: {
              pos: pos,
              src: val,

              label: childlabel,
              onShowSkillTree: (props) => {
                setSelectedSkillTreeProps(props);
              },
              SkillTreeProps: prop,
              textColor: "#ffffff",
            },
          });
          edges.push({
            id: `edge-${Math.random()}`,
            source: "root",
            target: `child${ind}`,
            type: "custom",
            style: { stroke: "#54c1e6", strokeWidth: 5 },
          });
        });
        setNodes(nodes);
        setEdges(edges);
      }
    }, [srcArr, labelArr, props]);

    const nodeTypes = { img: customNode };
    const edgeTypes = { custom: CustomEdges };

    const closeOverlay = () => {
      setSelectedSkillTreeProps(null);
    };
    return (
      <div ref={nodeRef} className="relative w-full h-full">
        <ReactFlow
          nodes={Nodes}
          edges={Edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        ></ReactFlow>
        {selectedSkillTreeProps && (
          <div
            className="absolute inset-0 w-full h-full z-30 flex justify-center items-center bg-[#090B10] bg-opacity-90"
            onClick={closeOverlay}
          >
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
          </div>
        )}
      </div>
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default memo(TreeMap);
