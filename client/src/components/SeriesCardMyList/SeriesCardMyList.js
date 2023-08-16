import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import SeriesInfoModal from "../SeriesInfo/SeriesInfo";

const GET_MY_SERIES_LIST = "http://localhost:8800/api/movies/find/series/";

const SeriesCardMyList = ({ seriesId, flag }) => {
  const [series, setSeries] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);

  const useStyles = makeStyles((theme) => ({
    card: {
      maxWidth: 345,
      height: 500,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "black",
      color: "white",
      marginTop: flag ? "0px" : "100px",
      cursor: "pointer",
    },
    media: {
      height: 400,
      backgroundSize: "contain",
    },
    title: {
      fontWeight: 700,
      textAlign: "center",
    },
  }));

  useEffect(() => {
    const getSeries = async () => {
      try {
        const res = await axios.get(`${GET_MY_SERIES_LIST}${seriesId}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("auth")).token,
          },
        });
        setSeries(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSeries();
  }, [seriesId]);

  const classes = useStyles();

  return (
    <>
      {" "}
      <SeriesInfoModal
        key={series._id}
        series={series}
        open={showInfoModal}
        onClose={setShowInfoModal}
      />
      <Card className={classes.card} onClick={() => setShowInfoModal(true)}>
        <CardMedia
          className={classes.media}
          image={series?.imgSm}
          title={series?.title}
        />
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.title}>
            {series?.title}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default SeriesCardMyList;
