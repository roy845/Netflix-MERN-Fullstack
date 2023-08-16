import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import TableChartIcon from "@material-ui/icons/TableChart";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewListIcon from "@material-ui/icons/ViewList";

const generateRandomColor = () => {
  const minBrightness = 0.6; // Minimum brightness value (0-1)
  let color = "#000000"; // Start with black color

  while (color === "#000000") {
    // Generate random RGB values
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Calculate brightness of the color
    const brightness = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

    // Check if the brightness is higher than the minimum
    if (brightness >= minBrightness) {
      // Convert RGB values to hex format
      color = `#${red.toString(16).padStart(2, "0")}${green
        .toString(16)
        .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
    }
  }

  return color;
};

const useStyles = makeStyles((theme) => ({
  toggleButton: {
    backgroundColor: "black",
    color: generateRandomColor(),
    border: `1px solid ${generateRandomColor()}`,
    "&.Mui-selected": {
      backgroundColor: generateRandomColor(),
      color: "black",
      "&:hover": {
        backgroundColor: generateRandomColor(),
      },
    },
  },
}));
const MoviesAnalytics = ({ timeSpentWatchingMovies }) => {
  const [displayMode, setDisplayMode] = useState("graphs");
  const [chartMode, setChartMode] = useState("grid");

  const handleDisplayModeChange = (event, newDisplayMode) => {
    setDisplayMode(newDisplayMode);
  };

  const handleChartModeChange = (event, newChartMode) => {
    setChartMode(newChartMode);
  };

  const classes = useStyles();
  return (
    <div>
      <ToggleButtonGroup
        value={displayMode}
        exclusive
        onChange={handleDisplayModeChange}
        aria-label="display mode"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToggleButton
          value="graphs"
          aria-label="graphs"
          className={classes.toggleButton}
        >
          <ShowChartIcon />
          Graphs
        </ToggleButton>
        <ToggleButton
          value="table"
          aria-label="table"
          className={classes.toggleButton}
        >
          <TableChartIcon />
          Table
        </ToggleButton>
      </ToggleButtonGroup>
      {displayMode === "graphs" ? (
        <>
          <ToggleButtonGroup
            value={chartMode}
            exclusive
            onChange={handleChartModeChange}
            aria-label="chart mode"
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButton
              value="grid"
              aria-label="grid"
              className={classes.toggleButton}
            >
              <ViewComfyIcon />
            </ToggleButton>
            <ToggleButton
              value="stacked"
              aria-label="stacked"
              className={classes.toggleButton}
            >
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {chartMode === "grid" && (
            <Grid container spacing={2}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <LineChart
                    width={500}
                    height={300}
                    data={timeSpentWatchingMovies}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <BarChart
                    width={500}
                    height={300}
                    data={timeSpentWatchingMovies}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                  </BarChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <AreaChart
                    width={500}
                    height={300}
                    data={timeSpentWatchingMovies}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      fill={generateRandomColor()}
                    />
                  </AreaChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <RadarChart
                    cx={300}
                    cy={250}
                    outerRadius={150}
                    width={600}
                    height={500}
                    data={timeSpentWatchingMovies}
                  >
                    <PolarGrid stroke={generateRandomColor()} />
                    <PolarAngleAxis
                      dataKey="date"
                      stroke={generateRandomColor()}
                    />
                    <PolarRadiusAxis stroke={generateRandomColor()} />
                    <Radar
                      name="timeSpent"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      fill={generateRandomColor()}
                      fillOpacity={0.6}
                    />

                    <Legend />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}<br/>`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                  </RadarChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ComposedChart
                    width={500}
                    height={300}
                    data={timeSpentWatchingMovies}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                    <Legend />
                    <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                    <Line
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      dot={{ r: 5 }}
                    />
                  </ComposedChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <PieChart width={500} height={300}>
                    <Pie
                      data={timeSpentWatchingMovies}
                      dataKey="timeSpent"
                      nameKey="date"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {timeSpentWatchingMovies?.map((entry, index) => (
                        <Cell key={index} fill={generateRandomColor()} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                  </PieChart>
                </Grid>
              </div>
            </Grid>
          )}

          {chartMode === "stacked" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LineChart
                width={500}
                height={300}
                data={timeSpentWatchingMovies}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  dot={{ r: 5 }}
                />
              </LineChart>
              <BarChart width={500} height={300} data={timeSpentWatchingMovies}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Bar dataKey="timeSpent" fill={generateRandomColor()} />
              </BarChart>
              <AreaChart
                width={500}
                height={300}
                data={timeSpentWatchingMovies}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  fill={generateRandomColor()}
                />
              </AreaChart>
              <RadarChart
                cx={300}
                cy={250}
                outerRadius={150}
                width={600}
                height={500}
                data={timeSpentWatchingMovies}
              >
                <PolarGrid stroke={generateRandomColor()} />
                <PolarAngleAxis dataKey="date" stroke={generateRandomColor()} />
                <PolarRadiusAxis stroke={generateRandomColor()} />
                <Radar
                  name="timeSpent"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  fill={generateRandomColor()}
                  fillOpacity={0.6}
                />

                <Legend />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}<br/>`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
              </RadarChart>
              <ComposedChart
                width={500}
                height={300}
                data={timeSpentWatchingMovies}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
                <Legend />
                <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                <Line
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  dot={{ r: 5 }}
                />
              </ComposedChart>{" "}
              <PieChart width={500} height={300}>
                <Pie
                  data={timeSpentWatchingMovies}
                  dataKey="timeSpent"
                  nameKey="date"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={generateRandomColor()}
                  label
                >
                  {timeSpentWatchingMovies?.map((entry, index) => (
                    <Cell key={index} fill={generateRandomColor()} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
              </PieChart>
            </div>
          )}
        </>
      ) : (
        <TableContainer
          component={Paper}
          style={{
            border: `1px solid ${generateRandomColor()}`,
            marginTop: "20px",
          }}
        >
          <Table
            style={{
              backgroundColor: "black",
              border: `1px solid ${generateRandomColor()}`,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                >
                  Time Spent (Minutes)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                color: generateRandomColor(),
                border: `1px solid ${generateRandomColor()}`,
              }}
            >
              {timeSpentWatchingMovies?.map((dataPoint, index) => (
                <TableRow
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                  key={index}
                >
                  <TableCell
                    style={{
                      color: generateRandomColor(),
                      border: `1px solid ${generateRandomColor()}`,
                    }}
                  >
                    {dataPoint.date}
                  </TableCell>
                  <TableCell
                    style={{
                      color: generateRandomColor(),
                      border: `1px solid ${generateRandomColor()}`,
                    }}
                  >
                    {dataPoint.timeSpent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MoviesAnalytics;
