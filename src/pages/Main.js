import TodaysWeather from "../components/TodaysWeather";
import TodaysAgriNews from "../components/TodaysAgriNews";
export default function Main() {
  return (
    <div className="page-container main-test">
        <TodaysWeather />
        <TodaysAgriNews />
    </div>
  );
}