import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
const GraficaTortaProductos = () => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '1%',
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
          { value: 1048, name: 'Producto 1' },
          { value: 735, name: 'Producto 2' },
          { value: 580, name: 'Producto 3' },
          { value: 484, name: 'Producto 4' },
          { value: 300, name: 'Producto 5' }
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

export default GraficaTortaProductos;
