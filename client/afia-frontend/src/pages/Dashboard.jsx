import React from 'react';
import Chart from '../components/Charts/RadialChart';
import Card from '../components/Cards/SmallCards';


const pdfs = [
  {id: 1, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 1", caption: "This is a dummy PDF file", public: true},
  {id: 2, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 2", caption: "This is a dummy PDF file", public: true},
  {id: 3, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 3", caption: "This is a dummy PDF file", public: false },
  {id: 4, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 4", caption: "This is a dummy PDF file", public: true},
];

const Dashboard = () => {
  const chartOptions = {
    series: [44, 55, 67, 83],
    chart: {
      height: 350,
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
              return 249;
            },
          },
        },
      },
    },
    labels: ['words-translated', 'stories-written', 'bot interactions', 'stories-read'],
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
                {pdfs.map((pdf) => (
                  <Card
                    key={pdf.id}
                    percentage={pdf.public ? "Public" : "Private"} // Set the percentage to "Public" or "Private"
                    value={pdf.title} // Set value to the PDF title
                    label={pdf.caption} // Set label to the PDF caption
                  />
                ))}
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
