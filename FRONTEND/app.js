// Dynamic data loaded from JSON files
let areaData = {};
let ecoSummaryData = {};
let trendData = {};

// Load data from JSON files
async function loadData() {
  try {
    // Load area statistics
    const areaResponse = await fetch("data/area_stats.json");
    areaData = await areaResponse.json();

    // Load ecological summaries
    const ecoResponse = await fetch("data/eco_summaries.json");
    ecoSummaryData = await ecoResponse.json();

    // Load trend data
    const trendResponse = await fetch("data/trend_data.json");
    trendData = await trendResponse.json();

    console.log("✅ Data loaded successfully");
    return true;
  } catch (error) {
    console.error("❌ Error loading data:", error);
    // Fallback to demo data if JSON files not found
    useFallbackData();
    return false;
  }
}

// Fallback demo data if JSON files are missing
function useFallbackData() {
  console.warn(
    "⚠️ Using fallback demo data. Run notebook 06 to generate real data.",
  );
  areaData = {
    2020: [
      {
        category: "Seagrass",
        area: 420.1,
        change: 0.0,
      },
      {
        category: "Sand",
        area: 122.0,
        change: 0.0,
      },
      {
        category: "Water",
        area: 870.0,
        change: 0.0,
      },
      {
        category: "Landmass",
        area: 78.0,
        change: 0.0,
      },
    ],
    2021: [
      {
        category: "Seagrass",
        area: 430.0,
        change: 2.4,
      },
      {
        category: "Sand",
        area: 121.0,
        change: -0.8,
      },
      {
        category: "Water",
        area: 875.0,
        change: 0.6,
      },
      {
        category: "Landmass",
        area: 78.1,
        change: 0.1,
      },
    ],
    2022: [
      {
        category: "Seagrass",
        area: 440.0,
        change: 2.3,
      },
      {
        category: "Sand",
        area: 120.8,
        change: -0.2,
      },
      {
        category: "Water",
        area: 880.0,
        change: 0.6,
      },
      {
        category: "Landmass",
        area: 78.2,
        change: 0.1,
      },
    ],
    2023: [
      {
        category: "Seagrass",
        area: 450.2,
        change: 2.3,
      },
      {
        category: "Sand",
        area: 120.5,
        change: -0.2,
      },
      {
        category: "Water",
        area: 890.3,
        change: 1.2,
      },
      {
        category: "Landmass",
        area: 78.1,
        change: -0.1,
      },
    ],
    2024: [
      {
        category: "Seagrass",
        area: 455.0,
        change: 1.1,
      },
      {
        category: "Sand",
        area: 120.0,
        change: -0.4,
      },
      {
        category: "Water",
        area: 892.0,
        change: 0.2,
      },
      {
        category: "Landmass",
        area: 78.1,
        change: 0.0,
      },
    ],
    2025: [
      {
        category: "Seagrass",
        area: 460.0,
        change: 1.1,
      },
      {
        category: "Sand",
        area: 119.5,
        change: -0.4,
      },
      {
        category: "Water",
        area: 895.0,
        change: 0.3,
      },
      {
        category: "Landmass",
        area: 78.1,
        change: 0.0,
      },
    ],
  };

  ecoSummaryData = {
    2020: "Baseline year established for coastal monitoring. Initial seagrass coverage: 420.1 km\u00b2.",
    2021: "During 2021, seagrass coverage <b>increased</b> by 9.9 km\u00b2 compared to 2020. \n        Sand shoals contracted by 1.0 km\u00b2. \n        Overall, the coastal ecosystem shows positive trends in biodiversity indicators.",
    2022: "During 2022, seagrass coverage <b>increased</b> by 10.0 km\u00b2 compared to 2021. \n        Sand shoals contracted by 0.2 km\u00b2. \n        Overall, the coastal ecosystem shows positive trends in biodiversity indicators.",
    2023: "During 2023, seagrass coverage <b>increased</b> by 10.2 km\u00b2 compared to 2022. \n        Sand shoals contracted by 0.3 km\u00b2. \n        Overall, the coastal ecosystem shows positive trends in biodiversity indicators.",
    2024: "During 2024, seagrass coverage <b>increased</b> by 4.8 km\u00b2 compared to 2023. \n        Sand shoals contracted by 0.5 km\u00b2. \n        Overall, the coastal ecosystem shows positive trends in biodiversity indicators.",
    2025: "During 2025, seagrass coverage <b>increased</b> by 5.0 km\u00b2 compared to 2024. \n        Sand shoals contracted by 0.5 km\u00b2. \n        Overall, the coastal ecosystem shows positive trends in biodiversity indicators.",
  };
  trendData = {
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    seagrass: [420.1, 430.0, 440.0, 450.2, 455.0, 460.0],
    sand: [122.0, 121.0, 120.8, 120.5, 120.0, 119.5],
    water: [870.0, 875.0, 880.0, 890.3, 892.0, 895.0],
    landmass: [78.0, 78.1, 78.2, 78.1, 78.1, 78.1],
  };
}

function updateAreaTable(year) {
  const table = document.getElementById("areaTable");
  table.innerHTML = "";

  if (!areaData[year]) {
    table.innerHTML =
      '<tr><td colspan="3">No data available for this year</td></tr>';
    return;
  }

  let total = 0;
  areaData[year].forEach((row) => {
    total += row.area;
    let changeClass = row.change > 0 ? "pos" : row.change < 0 ? "neg" : "";
    let changeStr =
      row.change > 0
        ? `+${row.change}%`
        : row.change < 0
          ? `${row.change}%`
          : "0.0%";
    table.innerHTML += `<tr><td>${row.category}</td><td>${row.area}</td><td class="${changeClass}">${changeStr}</td></tr>`;
  });
  document.getElementById("totalArea").textContent = total.toFixed(1);
}

function updateEcoSummary(year) {
  document.getElementById("ecoSummary").innerHTML =
    ecoSummaryData[year] || "No summary available for this year.";
}

function updateMap(year) {
  // Try to load year-specific map, fallback to placeholder
  const mapImg = document.getElementById("coverageMap");
  mapImg.src = `data/map_${year}.png`;
  mapImg.onerror = function () {
    this.src = "map-placeholder.svg";
  };
}

function updateTrendChart() {
  const ctx = document.getElementById("trendChart").getContext("2d");
  if (window.trendChartObj) window.trendChartObj.destroy();

  const datasets = [
    {
      label: "Seagrass",
      data: trendData.seagrass,
      borderColor: "#1a936f",
      backgroundColor: "rgba(26,147,111,0.1)",
      fill: true,
    },
    {
      label: "Sand",
      data: trendData.sand,
      borderColor: "#ffe156",
      backgroundColor: "rgba(255,225,86,0.1)",
      fill: true,
    },
    {
      label: "Water",
      data: trendData.water,
      borderColor: "#0077b6",
      backgroundColor: "rgba(0,119,182,0.1)",
      fill: true,
    },
  ];

  // Add landmass if available
  if (trendData.landmass) {
    datasets.push({
      label: "Landmass",
      data: trendData.landmass,
      borderColor: "#8b4513",
      backgroundColor: "rgba(139,69,19,0.1)",
      fill: true,
    });
  }

  window.trendChartObj = new Chart(ctx, {
    type: "line",
    data: {
      labels: trendData.years,
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// Initialize dashboard
async function initDashboard() {
  // Load data first
  await loadData();

  // Set up year selector event
  document.getElementById("yearSelect").addEventListener("change", function () {
    const year = this.value;
    updateAreaTable(year);
    updateEcoSummary(year);
    updateMap(year);
  });

  // Initial load with default year (2023)
  updateAreaTable("2023");
  updateEcoSummary("2023");
  updateMap("2023");
  updateTrendChart();
}

// Start when page loads
window.addEventListener("DOMContentLoaded", initDashboard);
