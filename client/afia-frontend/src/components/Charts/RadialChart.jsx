// RadialChart.jsx
import React from 'react';
import ApexCharts from 'react-apexcharts';

const RadialChart = ({ chartOptions }) => {
  return <ApexCharts options={chartOptions} series={chartOptions.series} type="radialBar" height={350} />;
};

export default RadialChart;
