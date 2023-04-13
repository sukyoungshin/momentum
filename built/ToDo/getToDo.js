import { constantKeys, createTodoHTMLElements, getConstants, getHTMLElements } from "../common/utils.js";
export function updateToDo() {
    const { $toDoForm } = getHTMLElements();
    if (!$toDoForm)
        return;
    $toDoForm.addEventListener("submit", submitToDo);
}
/** TO DO */
let toDos = [];
function saveToDos() {
    const { TODOS } = getConstants(constantKeys.TODO);
    localStorage.setItem(TODOS, JSON.stringify(toDos));
}
function deleteToDo(e) {
    const target = e.currentTarget;
    const li = target.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id, 10));
    saveToDos();
}
function addToDo(newToDo) {
    const { $toDoList } = getHTMLElements();
    const { $li, $checkbox, $label, $span, $button } = createTodoHTMLElements();
    const randomId = Math.floor(Math.random() * 1000);
    // id 및 클래스명 부여
    $li.id = String(newToDo.id); // li에 id값 부여
    $label.setAttribute("for", `${randomId}`); // checkbox와 label 연동
    $checkbox.id = `${randomId}`;
    $span.innerText = newToDo.text;
    $button.addEventListener("click", deleteToDo);
    $li.append($checkbox);
    $li.append($label);
    $li.append($span);
    $li.append($button);
    $toDoList === null || $toDoList === void 0 ? void 0 : $toDoList.append($li);
}
function resetToDoInput($input) {
    $input.value = "";
}
function submitToDo(e) {
    e.preventDefault();
    const { $toDoInput } = getHTMLElements();
    if (!$toDoInput)
        return;
    const newToDo = {
        id: Date.now(),
        text: $toDoInput === null || $toDoInput === void 0 ? void 0 : $toDoInput.value,
    };
    toDos.push(newToDo);
    addToDo(newToDo);
    saveToDos();
    resetToDoInput($toDoInput);
}
/** localStorage 투두 정보 */
export function getLocalStorageToDos() {
    const { TODOS } = getConstants(constantKeys.TODO);
    const savedToDos = localStorage.getItem(TODOS);
    if (savedToDos !== null) {
        const parsedToDos = JSON.parse(savedToDos);
        toDos = parsedToDos;
        parsedToDos.forEach(addToDo);
    }
}
