import axios from "axios";
import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";

const GET_DEVICE_INFO = "http://localhost:8800/api/os";

function DeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    paltform: "",
    arch: "",
    hostname: "",
    freeMemory: "",
    totalMemory: "",
  });

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const { data } = await axios.get(GET_DEVICE_INFO);
        setDeviceInfo({
          arch: data.arch,
          platform: data.platform,
          hostname: data.hostname,
          freeMemory: data.freeMemory,
          totalMemory: data.totalMemory,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getDeviceInfo();
  }, []);

  const freeMemoryGB = (deviceInfo.freeMemory / (1024 * 1024 * 1024)).toFixed(
    2
  );
  const totalMemoryGB = (deviceInfo.totalMemory / (1024 * 1024 * 1024)).toFixed(
    2
  );
  const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
  const memoryUsage = (usedMemoryGB / totalMemoryGB) * 100;

  return (
    <div style={{ marginLeft: "10px" }}>
      <p>Platform: {deviceInfo.platform}</p>
      <p>Architecture: {deviceInfo.arch}</p>
      <p>Hostname: {deviceInfo.hostname}</p>
      <p>Used Memory:{usedMemoryGB}GB</p>
      <p>Free Memory:{freeMemoryGB}GB</p>
      <p>Total Memory: {totalMemoryGB}GB</p>
      <LinearProgress variant="determinate" value={memoryUsage} />
      <style jsx global>{`
        .MuiLinearProgress-barColorPrimary {
          background-color: #bf1131;
        }
        .MuiLinearProgress-bar1Buffer {
          background-color: #d8d8d8;
        }
      `}</style>
      <p style={{ color: "white" }}>Memory Usage: {memoryUsage.toFixed(2)}%</p>
    </div>
  );
}

export default DeviceInfo;
