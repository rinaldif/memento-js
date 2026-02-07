import { buildCalendarMatrix } from './calculations.js';

/**
 * Render the Memento Mori heatmap using Plotly.
 * @param {Date} dob
 * @param {string} containerId - DOM element id to render into
 */
export function renderMementoMori(dob, containerId) {
  const { z, xLabels, yLabels, xLabel, yLabel } = buildCalendarMatrix(dob);

  const trace = {
    z,
    x: xLabels,
    y: yLabels,
    type: 'heatmap',
    colorscale: [[0, 'lightgrey'], [1, 'darkgrey']],
    showscale: false,
    hoverinfo: 'none',
  };

  const container = document.getElementById(containerId);
  const marginL = 35, marginR = 5, marginT = 30, marginB = 5;
  const numCols = xLabels.length;   // 52 (weeks)
  const numRows = yLabels.length;   // 80 (years)

  // Fit chart within both container width AND viewport height (keep cells square).
  // Use 80% of viewport height so the chart is visible at a glance with some
  // room for the surrounding text.
  const availableWidth = container.clientWidth || 600;
  const availableHeight = window.innerHeight * 0.8;
  const cellFromWidth = (availableWidth - marginL - marginR) / numCols;
  const cellFromHeight = (availableHeight - marginT - marginB) / numRows;
  const cellSize = Math.min(cellFromWidth, cellFromHeight);
  const width = cellSize * numCols + marginL + marginR;
  const height = cellSize * numRows + marginT + marginB;

  // White grid lines (shapes)
  const shapes = [];

  // Vertical lines
  for (let i = 0; i < numCols; i++) {
    shapes.push({
      type: 'line',
      x0: 0.5 + i, y0: 0.5,
      x1: 0.5 + i, y1: numRows + 0.5,
      line: { color: 'white', width: 1 },
    });
  }

  // Horizontal lines
  for (let i = 0; i < numRows; i++) {
    shapes.push({
      type: 'line',
      x0: 0.5, y0: 0.5 + i,
      x1: numCols + 0.5, y1: 0.5 + i,
      line: { color: 'white', width: 1 },
    });
  }

  const layout = {
    width,
    height,
    xaxis: {
      side: 'top',
      dtick: 5,
    },
    yaxis: {
      autorange: 'reversed',
      dtick: 5,
    },
    shapes,
    margin: { l: marginL, r: marginR, t: marginT, b: marginB },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#FAFAFA' },
  };

  Plotly.newPlot(container, [trace], layout, { displayModeBar: false, staticPlot: true });
}
