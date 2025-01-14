import TodaysWeather from "../components/TodaysWeather";
import TodaysPriceInfo from "../components/TodaysPriceInfo";
import TodaysAgriNews from "../components/TodaysAgriNews";
import AIChatBot from "../components/AIChatBot";

export default function Main() {
  return (
    <div className="page-container main-test">
        <TodaysWeather />
        <TodaysPriceInfo />
        <TodaysAgriNews />
        <AIChatBot />

    </div>
  );
}