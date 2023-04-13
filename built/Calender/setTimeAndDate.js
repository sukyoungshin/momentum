import { months, weekdays } from "../common/data.js";
import { getHTMLElements } from "../common/utils.js";
export function updateTimeAndDate() {
    setTodayInformationAndTime();
    setInterval(setTodayInformationAndTime, 1000 * 60);
}
/** 현재 시간과 날짜를 셋팅 */
function setTodayInformationAndTime() {
    const { $date, $time } = getHTMLElements();
    if (!$date || !$time)
        return;
    const { year, month, date, day } = getCurrentDate();
    const time = getCurrentTime();
    $date.innerText = `${month} ${day}, ${year} ( ${date} )`;
    $time.innerText = `${time}`;
}
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear(); // 연도
    const monthIndex = today.getMonth();
    const month = months[monthIndex]; // 월
    const dayIndex = today.getDay();
    const date = weekdays[dayIndex]; // 요일
    const day = today.getDate(); // 날짜
    return { year, month, date, day };
}
function getCurrentTime() {
    const today = new Date();
    const time = today.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
    });
    return time;
}
/** 현재연도 업데이트 (footer) */
export function updateThisYear() {
    const { $thisYear } = getHTMLElements();
    if (!!$thisYear) {
        $thisYear.innerText = String(new Date().getFullYear());
    }
}
