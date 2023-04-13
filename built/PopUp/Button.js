import { randomEmojis } from "../common/data.js";
import { constantKeys, getConstants, getHTMLElements, getRandomIndex } from "../common/utils.js";
export function updatePopUp() {
    const { $loginForm, $loginInput } = getHTMLElements();
    if (!$loginForm || !$loginInput)
        return;
    $loginInput.addEventListener("input", changePopUpButtonColor);
    $loginForm.addEventListener("submit", submitUserNameInPopUp);
}
/** 팝업창 submit 버튼색상 변경 */
export function changePopUpButtonColor() {
    const { $loginInput, $loginButton } = getHTMLElements();
    if (!$loginInput || !$loginButton)
        return;
    const { ACTIVE } = getConstants(constantKeys.LOGIN_POPUP);
    if ($loginInput.value.length >= 1) {
        $loginButton === null || $loginButton === void 0 ? void 0 : $loginButton.classList.add(ACTIVE);
    }
    else {
        $loginButton === null || $loginButton === void 0 ? void 0 : $loginButton.classList.remove(ACTIVE);
    }
}
/** 로그인버튼 제출 */
export function submitUserNameInPopUp(e) {
    e.preventDefault();
    const { $modal, $loginInput } = getHTMLElements();
    if (!$modal || !$loginInput)
        return;
    const { HIDDEN, USERNAME } = getConstants(constantKeys.LOGIN_POPUP);
    $modal.classList.add(HIDDEN);
    const username = $loginInput.value;
    localStorage.setItem(USERNAME, username); // localStorage에 유저이름 저장
    setUserNameOnProfile(username); // 입력받은 username을 프로필에 나타냄
}
/** 프로필 영역에 유저이름 나타냄 */
function setUserNameOnProfile(username) {
    const { $greeting } = getHTMLElements();
    if (!$greeting)
        return;
    const index = getRandomIndex(randomEmojis);
    const randomEmoji = randomEmojis[index];
    $greeting.innerText = `${username} ${randomEmoji}`;
}
