import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
const GraficaTorta = () => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '3%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#000',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Puesto 1' },
          { value: 735, name: 'Puesto 2' },
          { value: 580, name: 'Puesto 3' },
          { value: 484, name: 'Puesto 4' },
          { value: 300, name: 'Puesto 5' }
        ]
      }
    ]
  };

  return (
    <div className="h-100 w-100">
      <ReactECharts option={option} theme="dark" className="h-100 w-100" />
    </div>
  );
};

export default GraficaTorta;
