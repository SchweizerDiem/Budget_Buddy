// helper functions
import { fetchData } from "../helpers";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
}

const Dashboard = () => {
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard;
