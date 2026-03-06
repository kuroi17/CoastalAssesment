// Demo data for 2023 (replace with real data or API calls)
const areaData = {
  2020: [
    { category: "Seagrass", area: 420.1, change: -1.5 },
    { category: "Sand Shoals", area: 122.0, change: 0.0 },
    { category: "Open Water", area: 870.0, change: 0.0 },
    { category: "Rocky Reef", area: 78.0, change: 0.0 },
  ],
  2021: [
    { category: "Seagrass", area: 430.0, change: 2.4 },
    { category: "Sand Shoals", area: 121.0, change: -0.8 },
    { category: "Open Water", area: 875.0, change: 0.6 },
    { category: "Rocky Reef", area: 78.1, change: 0.1 },
  ],
  2022: [
    { category: "Seagrass", area: 440.0, change: 2.3 },
    { category: "Sand Shoals", area: 120.8, change: -0.2 },
    { category: "Open Water", area: 880.0, change: 0.6 },
    { category: "Rocky Reef", area: 78.2, change: 0.1 },
  ],
  2023: [
    { category: "Seagrass", area: 450.2, change: 2.4 },
    { category: "Sand Shoals", area: 120.5, change: -1.2 },
    { category: "Open Water", area: 890.3, change: 0.5 },
    { category: "Rocky Reef", area: 78.1, change: 0.0 },
  ],
  2024: [
    { category: "Seagrass", area: 455.0, change: 1.1 },
    { category: "Sand Shoals", area: 120.0, change: -0.4 },
    { category: "Open Water", area: 892.0, change: 0.2 },
    { category: "Rocky Reef", area: 78.1, change: 0.0 },
  ],
  2025: [
    { category: "Seagrass", area: 460.0, change: 1.1 },
    { category: "Sand Shoals", area: 119.5, change: -0.4 },
    { category: "Open Water", area: 895.0, change: 0.3 },
    { category: "Rocky Reef", area: 78.1, change: 0.0 },
  ],
};

const ecoSummaryData = {
  2023: `During the 2023 analysis cycle, the coastal ecosystem showed a significant recovery in <b>seagrass meadow density</b>, growing by 2.4% compared to the previous year. This growth is attributed to improved water clarity and reduced local runoff.<br><br>However, <b>sand shoals</b> have experienced a slight contraction of 1.2% due to increased storm surge activities in the late autumn. This shift indicates a potential migration of sediment into deeper water zones, which is reflected in the 0.5% increase in open water area.<br><br><em>“Overall, the system remains resilient, but monitoring of sediment displacement should be prioritized in the next quarter.”</em>`,
};

const trendData = {
  years: [2020, 2021, 2022, 2023, 2024, 2025],
  seagrass: [420.1, 430.0, 440.0, 450.2, 455.0, 460.0],
  sand: [122.0, 121.0, 120.8, 120.5, 120.0, 119.5],
  water: [870.0, 875.0, 880.0, 890.3, 892.0, 895.0],
};

function updateAreaTable(year) {
  const table = document.getElementById("areaTable");
  table.innerHTML = "";
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
    ecoSummaryData[year] || "No summary available.";
}

function updateMap(year) {
  // Placeholder: swap image if you have per-year maps
  document.getElementById("coverageMap").src = "map-placeholder.png";
}

function updateTrendChart() {
  const ctx = document.getElementById("trendChart").getContext("2d");
  if (window.trendChartObj) window.trendChartObj.destroy();
  window.trendChartObj = new Chart(ctx, {
    type: "line",
    data: {
      labels: trendData.years,
      datasets: [
        {
          label: "Seagrass",
          data: trendData.seagrass,
          borderColor: "#1a936f",
          backgroundColor: "rgba(26,147,111,0.1)",
          fill: true,
        },
        {
          label: "Sand Shoals",
          data: trendData.sand,
          borderColor: "#ffe156",
          backgroundColor: "rgba(255,225,86,0.1)",
          fill: true,
        },
        {
          label: "Open Water",
          data: trendData.water,
          borderColor: "#0077b6",
          backgroundColor: "rgba(0,119,182,0.1)",
          fill: true,
        },
      ],
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

document.getElementById("yearSelect").addEventListener("change", function () {
  const year = this.value;
  updateAreaTable(year);
  updateEcoSummary(year);
  updateMap(year);
});

// Initial load
updateAreaTable("2023");
updateEcoSummary("2023");
updateMap("2023");
updateTrendChart();
