import { useState } from "react";
import BarGraph from "./BarGraph";
import AreaChart from "./AreaChart";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/ChartsContainer";

const ChartsContainer = () => {
  // Shows the Bar Chart
  const [barChart, setBarChart] = useState(true);
  // Pulling through the data and naming it data so its easier to write
  const { monthlyApplications: data } = useAppContext();
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button
        className="button"
        // Click it to switch the charts
        onClick={() => setBarChart(!barChart)}
      >
        {barChart ? "Area Chart" : "Bar Chart" /* Shows the opposite  */}
      </button>
      {/* If BarChart is true show it --> Otherwise show AreaChart */}
      {barChart ? <BarGraph data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
