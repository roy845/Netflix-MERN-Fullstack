import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import {
  LineStyle,
  PermIdentity,
  BarChart,
  List,
  PlayCircleOutline,
  Tv,
} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [sideBarItems, setBarItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);

  const handleItemClick = (id) => {
    if (id !== 6) {
      setSelectedItem(id);
      localStorage.setItem("selectedItem", JSON.stringify(id));
    } else {
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("clockState");
    }
  };

  const sidebarItems = [
    {
      id: 0,
      label: "Home",
      icon: <LineStyle className="sidebarIcon" />,
      to: "/dashboard",
    },
    {
      id: 1,
      label: "Users",
      icon: <PermIdentity className="sidebarIcon" />,
      to: "/dashboard/users",
    },
    {
      id: 2,
      label: "Movies",
      icon: <PlayCircleOutline className="sidebarIcon" />,
      to: "/dashboard/movies",
    },
    {
      id: 3,
      label: "Add Season",
      icon: <AddIcon className="sidebarIcon" />,
      to: "/dashboard/addSeason",
    },
    {
      id: 4,
      label: "Add Episode",
      icon: <AddCircleIcon className="sidebarIcon" />,
      to: "/dashboard/addEpisode",
    },
    {
      id: 5,
      label: "Lists",
      icon: <List className="sidebarIcon" />,
      to: "/dashboard/lists",
    },
    {
      id: 6,
      label: "Back to Main Page",
      icon: <BarChart className="sidebarIcon" />,
      to: "/",
    },
  ];

  useEffect(() => {
    setBarItems(sidebarItems);
    setSelectedItem(JSON.parse(localStorage.getItem("selectedItem")));
    localStorage.removeItem("selectedItem");
  }, []);

  const sideBar = sideBarItems.map((item, index) => {
    return (
      <Link to={item.to} className="link" key={index}>
        <li
          key={index}
          className={
            selectedItem === index
              ? "sidebarListItem active"
              : "sidebarListItem"
          }
          onClick={() => handleItemClick(item.id)}
        >
          {item.icon}
          {item.label}
        </li>
      </Link>
    );
  });

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menu</h3>
          <ul className="sidebarList">{sideBar}</ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
