import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJs,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { getLast7Days } from '../../libs/features';
import { purpleLight, purple, orangeLight, orange } from '../constants/Color';

// Generate the last 7 days' labels for chart axes
const labels = getLast7Days();

// Register the required chart.js components globally
ChartJs.register(
    Tooltip,        // Tooltips for hover functionality
    CategoryScale,  // Scales for the categories (x-axis)
    LinearScale,    // Scales for linear axes (y-axis)
    LineElement,    // Line element for the line chart
    PointElement,   // Point element to draw points on the line chart
    Filler,         // Fills area under the line chart
    ArcElement,     // Arc element for pie/doughnut chart slices
    Legend,         // Legend to display chart information
);

// Line chart options, including responsiveness and disabling the legend and title
const lineChartOptions = {
    responsive: true, // Makes the chart responsive to screen size
    plugins: {
        lagend: { // Disable legend display
            display: false,
        },
        title: {  // Disable title display
            display: false,
        },
    },
}

// LineChart component for rendering a line chart with revenue data
const LineChart = ({ value = [] }) => {
    const data = {
        labels, // Using the last 7 days as x-axis labels
        datasets: [
            {
                data: value, // Data for the line chart (values for each day)
                label: "Message", // Label for the dataset
                fill: false, // No filling under the line
                backgroundColor: "rgba(75,192,192,0.2)", // Background color for the line
                borderColor: "rgba(75,191,191,1)", // Border color for the line
            },
        ]
    };
    return (
        <Line
            data={data} // Passing the chart data
            options={lineChartOptions} // Applying the chart options
        />
    )
}

// Doughnut chart options with a cutout to make it look like a donut
const doughnutChartOptions = {
    responsive: true, // Makes the chart responsive
    plugins: {
        lagend: { // Disable legend display
            display: false,
        },
    },
    cutout: 120, // Cutout size to make the chart a donut
}

// DoughnutChart component for displaying a donut chart comparing chats and group chats
const DoughnutChart = ({ value = [], labels }) => {
    const data = {
        labels, // Labels for the doughnut chart slices
        datasets: [
            {
                data: value, // Values for each slice of the doughnut
                label: "Total chats vs Group chats", // Label for the dataset
                backgroundColor: [purpleLight, orangeLight], // Colors for each slice
                borderColor: [purple, orange], // Border colors for each slice
                hoverBackgroundColor: [purple, orange], // Hover colors for each slice
                offset: 40, // Offset for the slices to create a 'hole' effect
            },
        ]
    }
    return (
        <Doughnut
            data={data} // Passing the chart data
            options={doughnutChartOptions} // Applying the chart options
            style={{ zIndex: 10 }} // Ensuring the chart is above other elements
        />
    )
}

export { LineChart, DoughnutChart }; // Exporting the components for use in other parts of the app
