import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  const chartConfig = {
    series: [44, 55, 13, 43, 22],
    chart: {
      type: 'pie',
      width: 280,  // Set width as needed
      height: 280, // Set height as needed
      toolbar: {
        show: false,
      },
    },
    title: {
      text: '',
      align: 'center',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#020617', '#ff8f00', '#00897b', '#1e88e5', '#d81b60'],
    legend: {
      show: false,
    },
    labels: ['physics', 'ssci', 'Label 3', 'Label 4', 'Label 5'],
  };

  return (
    <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 mt-4 flex flex-col gap-4 overflow-hidden rounded-none bg-transparent bg-clip-border text-gray-700 shadow-none md:flex-row md:items-center">
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
            ></path>
          </svg>
        </div>
        <div>
          <h6 className="block font-sans text-base font-semibold leading-relaxed tracking-normal text-blue-gray-900 antialiased">
            Pie Chart
          </h6>
          <p className="block max-w-sm font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
            Visualize your data in a simple way using the
            @material-tailwind/html chart plugin.
          </p>
        </div>
      </div>
      <div className="py-6 mt-4 grid place-items-center px-2">
        <ReactApexChart
          options={chartConfig}
          series={chartConfig.series}
          type="pie"
          height={chartConfig.chart.height}
          width={chartConfig.chart.width}
        />
      </div>
    </div>
  );
};

export default PieChart;
