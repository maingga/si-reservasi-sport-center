"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import axios from "axios";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const [series, setSeries] = useState([{ name: "Confirmed Reservations", data: [] as number[] }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Base URL configuration - sesuaikan dengan setup Anda
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug log
        
        // Gunakan URL yang tepat sesuai route list
        const apiUrl = `${API_BASE_URL}/dashboard/monthly-confirmed`;

        console.log(`Trying URL: ${apiUrl}`);
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        };

        const response = await axios.get(apiUrl, config);
        console.log(`Success with URL: ${apiUrl}`, response.data);
        
        // Handle response data
        const data = response.data;
        console.log('Final response data:', data);
        
        if (data && data.data && Array.isArray(data.data)) {
          setSeries([{
            name: "Confirmed Reservations",
            data: data.data
          }]);
        } else if (data && Array.isArray(data)) {
          // Jika response langsung array
          setSeries([{
            name: "Confirmed Reservations",
            data: data
          }]);
        } else {
          throw new Error('Invalid data format from API');
        }
        
      } catch (error: any) {
        console.error("Error fetching reservation data:", error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.statusText || 
                           error.message || 
                           'Unknown error occurred';
        
        setError(`Error ${error.response?.status || 'Unknown'}: ${errorMessage}`);
        
        // Set default data
        setSeries([{
          name: "Confirmed Reservations",
          data: Array(12).fill(0)
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // Test function untuk debugging
  const testEndpoints = async () => {
    const endpoints = [
      
      '/api/dashboard/monthly-confirmed',
      '/api/admin/dashboard/monthly-confirmed'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint);
        console.log(`✅ ${endpoint}:`, response.status, response.data);
      } catch (error: any) {
        console.log(`❌ ${endpoint}:`, error.response?.status, error.message);
      }
    }
  };

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "",
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " reservations";
        },
      },
      theme: "dark",
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleRefreshData = () => {
    window.location.reload();
    closeDropdown();
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 dark:bg-gray-700"></div>
          <div className="h-40 bg-gray-100 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Reservasi
          </h3>
          {error && (
            <div className="mt-2">
              <p className="text-sm text-red-500">{error}</p>
              <button 
                onClick={testEndpoints}
                className="mt-1 text-xs text-blue-500 hover:text-blue-700 underline"
              >
                Debug Endpoints
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={handleRefreshData}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Refresh Data
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {series[0].data.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}