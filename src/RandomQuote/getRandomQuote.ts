import { disneyQuotes, images } from "../common/data.js";
import { BASE_URL, getHTMLElements, getRandomIndex } from "../common/utils.js";

export function updateRandomQuote() {
  changeQuoteBackgroundImage();
  fetchRandomQuotes();
}

/** Random Quote 호출 */
function fetchRandomQuotes() {
  const { $quote, $movie } = getHTMLElements();
  if (!$quote || !$movie) return;

  const index = getRandomIndex(disneyQuotes);
  const selectedQuote = disneyQuotes[index];

  $quote.innerText = selectedQuote.quote;
  $movie.innerText = selectedQuote.movie;
}

/** 배경이미지 랜덤지정 */
function changeQuoteBackgroundImage() {
  const { $randomImage } = getHTMLElements();
  if (!$randomImage) return;

  const index = getRandomIndex(images);
  const selectedImage = images[index];

  $randomImage.style.backgroundImage = `url(${BASE_URL}/${selectedImage})`;
}