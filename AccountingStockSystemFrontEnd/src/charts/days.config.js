// DAYS.config.js

// Weekly Revenue Series (will be populated dynamically)
export const WeeklyRevenueSeries = [
  {
    name: "Last Week",
    data: [], // Will be filled with last week's data
  },
  {
    name: "Running Week",
    data: [], // Will be filled with this week's data
  },
];

// Weekly Revenue Options
export const WeeklyRevenueOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  colors: ["#fe6c00", "#ffc397"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  stroke: {
    colors: ["transparent"],
    width: 4,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Days of the week
    labels: {
      style: {
        colors: "#bdbabb",
      },
    },
  },
  yaxis: {
    title: {
      text: "₦ (thousands)", // Changed to USD for consistency with your total sales
      style: {
        color: "#fe6c00",
      },
    },
    labels: {
      style: {
        colors: "#fff",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: {
      colors: "#fff", // Ensure legend text is visible on your gradient background
    },
  },
  tooltip: {
    y: {
      formatter(val) {
        return `$ ${val} thousands`;
      },
    },
  },
};
