import { ToDo, constantKeys, createTodoHTMLElements, getConstants, getHTMLElements, toDo } from "../common/utils.js";

export function updateToDo() {
  const { $toDoForm } = getHTMLElements();
  if (!$toDoForm) return;

  $toDoForm.addEventListener("submit", submitToDo);
}


/** TO DO */
let toDos: typeof toDo[] = [];
function saveToDos() {
  const { TODOS } = getConstants(constantKeys.TODO);
  localStorage.setItem(TODOS, JSON.stringify(toDos));
}

function deleteToDo(e: MouseEvent) {
  const target = e.currentTarget as Element;
  const li = target.parentElement as HTMLElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id, 10));
  saveToDos();
}

function addToDo(newToDo: ToDo) {
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
  $toDoList?.append($li);
}

function resetToDoInput($input: HTMLInputElement) {
  $input.value = "";
}

function submitToDo(e: SubmitEvent) {
  e.preventDefault();
  const { $toDoInput } = getHTMLElements();
  if (!$toDoInput) return;

  const newToDo = {
    id: Date.now(),
    text: $toDoInput?.value,
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