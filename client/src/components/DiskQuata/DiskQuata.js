import React, { useState, useEffect } from "react";
import axios from "axios";
import { LinearProgress, Typography } from "@material-ui/core";

const GET_DISK_STATS = "http://localhost:8800/api/disk";

function DiskUsage() {
  const [disk, setDisk] = useState(null);

  useEffect(() => {
    const getDiskStats = async () => {
      try {
        const { data } = await axios.get(GET_DISK_STATS);
        setDisk(data[0]);
      } catch (error) {}
    };
    getDiskStats();
  }, []);

  if (!disk) {
    return null;
  }

  const totalGB = (disk._blocks / (1024 * 1024 * 1024)).toFixed(2);
  const usedGB = (disk._used / (1024 * 1024 * 1024)).toFixed(2);
  const freeGB = (totalGB - usedGB).toFixed(2);

  const progress = Math.round((disk._used / disk._blocks) * 100);
  const remaining = 100 - progress;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", width: "200px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ flex: 1 }}
        />
        <Typography variant="body2" style={{ marginLeft: 10 }}>
          {`${progress}%`}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <span style={{ color: "white" }}>{`${usedGB} GB used`}</span>
        <span style={{ color: "white" }}>{`${freeGB} GB free`}</span>
        <span style={{ color: "white" }}>{`${totalGB} GB total`}</span>
      </div>

      <style jsx global>{`
        .MuiLinearProgress-barColorPrimary {
          background-color: #bf1131;
        }
        .MuiLinearProgress-bar1Buffer {
          background-color: #d8d8d8;
        }
      `}</style>
      <style jsx>{`
        span {
          font-size: 14px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}

export default DiskUsage;
