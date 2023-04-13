import { colors } from "../common/data.js";
import { getRandomIndex } from "../common/utils.js";
/** BODY 영역에 배경색상 지정 */
export function changeBodyBackgroundColor() {
    const index = getRandomIndex(colors);
    const left = colors[index];
    const right = colors[index];
    if (left !== right) {
        return (document.body.style.background = `linear-gradient(45deg, ${left}, ${right})`);
    }
    return (document.body.style.background = `linear-gradient(45deg, #e66465, #9198e5)`);
}
