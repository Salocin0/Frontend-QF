import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
const GraficaLineas = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['22:00', '22:30', '23:00', '0:00', '0:30', '1:00', '1:30','2:00',"2:30","3:00","3:30","4:00","4:30","5:00","5:30","6:00"]
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Producto 1',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132]
      },
      {
        name: 'Producto 2',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310,220, 182]
      },
      {
        name: 'Producto 3',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410,150, 232]
      },
      {
        name: 'Producto 4',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320,320, 332]
      },
      {
        name: 'Producto 5',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: [220, 432, 401, 434, 530, 430, 520,220, 432, 401, 434, 530, 430, 520,220, 432]
      }
    ]
  };

  return (
    <div className="h-100 w-100">
      <ReactECharts option={option} theme="dark" className="h-100 w-100" />
    </div>
  );
};

export default GraficaLineas;
