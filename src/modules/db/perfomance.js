import { getPerformance, trace } from "firebase/performance";

export default (app) => {
  const perf = getPerformance(app);

  return (name) => trace(perf, name);
}