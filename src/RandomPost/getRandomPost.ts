/** API 호출 (fake posts) */
export function fetchFakePosts() {
  const posts = "posts"; // queryParameter
  const url = `https://jsonplaceholder.typicode.com/${posts}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const $ul = document.querySelector<HTMLUListElement>("#dummy ul");

      json.map((item: { title: string }) => {
        const { title } = item;
        const $li = document.createElement("li");
        $li.innerText += `${title}`;
        $ul?.append($li);
      });
    });
}