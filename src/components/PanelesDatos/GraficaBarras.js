import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
const GraficaBarras = () => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: '3%',
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: [
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ],
    },
    series: [
      {
        name: "Puesto 1",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [320000, 302000, 301000, 334000, 390000, 330000, 320000],
      },
      {
        name: "Puesto 2",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [120000, 132000, 101000, 134000, 90000, 230000, 210000],
      },
      {
        name: "Puesto 3",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [220000, 182000, 191000, 234000, 290000, 330000, 310000],
      },
      {
        name: "puesto 4",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [150000, 212000, 201000, 154000, 190000, 330000, 410000],
      },
      {
        name: "Puesto 5",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [820000, 832000, 901000, 934000, 1290000, 1330000, 1320000],
      },
    ],
  };

  return (
    <div className="h-100 w-100">
      <ReactECharts option={option} theme="dark" className="h-100 w-100" />
    </div>
  );
};

export default GraficaBarras;
