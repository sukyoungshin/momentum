import { getHTMLElements } from "../common/utils.js";
/** 크리스마스 카운터 셋팅 및 업데이트 */
export function updateChristMasCounter() {
    setChristMasCounter();
    setInterval(setChristMasCounter, 1000);
}
function setChristMasCounter() {
    const { $clockTitle } = getHTMLElements();
    if (!$clockTitle)
        return;
    const { theDay, todayDecember, todayDate, days, hoursConvert, minutesConvert, secondsConvert, } = getChristMasInformation();
    // automatic logic for every christmas's counting
    if (todayDecember === 11 && todayDate >= 25) {
        theDay.setFullYear(theDay.getFullYear() + 1);
    }
    $clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
}
function getChristMasInformation() {
    const today = new Date();
    const theDay = new Date(today.getFullYear(), 11, 25);
    const milliSecondsGap = theDay.getTime() - today.getTime();
    const days = Math.floor(milliSecondsGap / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliSecondsGap / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((milliSecondsGap / (1000 * 60)) % 60);
    const seconds = Math.floor((milliSecondsGap / 1000) % 60);
    const hoursConvert = String(hours).padStart(2, "0");
    const minutesConvert = String(minutes).padStart(2, "0");
    const secondsConvert = String(seconds).padStart(2, "0");
    const todayDecember = today.getMonth(); // 11이면 12월
    const todayDate = today.getDate();
    return {
        theDay,
        todayDecember,
        todayDate,
        days,
        hoursConvert,
        minutesConvert,
        secondsConvert,
    };
}
