import React from "react";
import StatsItem from "./StatsItem";
import Wrapper from "../assets/wrappers/StatsContainer.js";
import { useAppContext } from "../context/appContext";
import { FaBug, FaCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";

const StatsContainer = () => {
  // Pulling through the stats data from backend to frontend
  const { stats } = useAppContext();
  // Our Layout for the StatsItem component
  const defaultStats = [
    {
      title: "pending applications",
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "interviews scheduled",
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "jobs declined",
      count: stats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ];

  // Mapping over the component with a spread operator rather than write all the variables out
  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatsItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
