import React, { useEffect, useMemo, useState, useContext } from "react";
import "./dashboard.scss";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Chart from "../../components/chart/Chart";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import Layout from "../../components/Layout/Layout";
import { UserContext } from "../../../../context/userContext/UserContext";
import { getUserStats } from "../../../../context/userContext/apiCalls";

const Dashboard = () => {
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  const { usersStats, dispatch } = useContext(UserContext);

  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    getUserStats(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (usersStats.length > 0) {
      setUserStats(
        usersStats
          .sort((a, b) => a._id - b._id)
          .map((item) => ({
            name: MONTHS[item._id - 1],
            "New User": item.total,
          }))
      );
    }
  }, [usersStats, MONTHS]);

  console.log(userStats);

  return (
    <Layout>
      <div className="home">
        <FeaturedInfo />
        <Chart
          title="User Analytics"
          data={userStats}
          dataKey="New User"
          grid
        />
        <div className="homeWidgets">
          <WidgetSm />
          <WidgetLg />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
