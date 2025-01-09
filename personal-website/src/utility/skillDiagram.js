"use client";

import React, { useEffect, useState, useRef } from "react";
import "../app/global.css";
import Chart from "chart.js/auto";
import { motion } from "motion/react";
import tailwindConfig from "../../tailwind.config.mjs";
const SkillWeb = ({ skills, vals }) => {
  const chartRef = useRef(null);
const [Aratio, SetRatio] = useState(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    if(Chart.getChart(myChartRef)){
        Chart.getChart(myChartRef).destroy();
    }
   const chart=  new Chart(myChartRef, {
      type: "radar",
      data: {
        labels: skills,
        datasets: [
          {
            label: "Skills",
            data: [8,6,5,4,4,6,5,4,7],
            fill: true,
            backgroundColor: "rgba(57, 196, 182, 0.8)",
            borderColor: "rgba(17, 102, 93, 1)",
            pointBackgroundColor: "rgba(254, 232, 1, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 99, 132, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          r: {
            angleLines: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            pointLabels: {
              color: "#daf7f4",
              font: {
                size: 10,
                family: "text",
              },
              
            },
            min:0,
            max:10,
            ticks: {
           
            stepSize:2,
              beginAtZero: true,
              display: false,
            },
          },
        },
      },
    });
    const ratio = chart.width / chart.height;
    SetRatio(ratio);
  }, [skills, vals]);
  return <canvas className="w-[400px]" style={{height: Aratio? `${400/Aratio}px`: 'auto'}} ref={chartRef}></canvas>;
};

export default SkillWeb;
