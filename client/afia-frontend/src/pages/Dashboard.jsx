// Dashboard.jsx
import React from 'react';
import Chart from '../components/Charts/RadialChart';
import Card from '../components/Cards/SmallCards';

const Dashboard = () => {
  const chartOptions = {
    series: [44, 55, 67, 83],
    chart: {
      height: 350,
      type: 'radialBar',
    },
    chart: {
      height: 500,  // Increased height for the chart
      width: 500,   // Added width property to control the size
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              // Custom total formatter
              return 249;
            },
          },
        },
      },
    },
    labels: ['words-translated', 'stories-written',
      'bot interactions', 'stories-read'],
  };

  return (
    <main>
      <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 ">
        <div className="grid grid-cols-12 gap-6">
          <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
            <div className="col-span-12 mt-8">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
              </div>
              <div className="grid grid-cols-12 gap-6 mt-5">
              <Card
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                  percentage={30}
                  value={4.510}
                  label="Item Sales"
                />
                <Card
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                  percentage={30}
                  value={4.510}
                  label="Item Sales"
                />
                <Card
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
                  percentage={30}
                  value={4.510}
                  label="Item Sales"
                />
                <Card
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
                  percentage={30}
                  value={4.510}
                  label="Item Sales"
                />
              </div>
            </div>

            {/* Sales Overview and Radial Chart */}
            <div className="col-span-12 md:col-span-12 lg:col-span-12 mt-10 flex justify-between items-center gap-8">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Sales Overview</p>
                  <p className="text-sm text-gray-500">This is a summary of the sales for the past month.</p>
                </div>
                <div className="flex justify-center items-center">
                  <Chart chartOptions={chartOptions} /> {/* Use the Chart component here */}
                </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
