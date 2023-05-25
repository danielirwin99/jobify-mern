import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { Loading, ChartsContainer, StatsContainer } from "../../components/index";

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();

  useEffect(() => {
    showStats();
    console.log(monthlyApplications);
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Stats;
