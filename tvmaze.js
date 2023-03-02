"use strict";

const TV_MAZE_BASE_URL = "http://api.tvmaze.com/";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/** Given a show query, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getShowsByTerm(searchQuery) {
  // make request
  const response = await axios.get(
    `${TV_MAZE_BASE_URL}/search/shows`,
    { params: { q: searchQuery }}
  );


  const prunedShows = response.data.map((showData) => {
    //why do we need .data here? not visible in Insom

    const placeholderImg =  // Could be a global const
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    let show = {
      id: showData.show.id,
      name: showData.show.name,
      summary: showData.show.summary,
      image: showData.show.image ? showData.show.image.medium : placeholderImg
    };


    return show;
  });

  return prunedShows;
}


/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    console.log("show.image= ", show.image);
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}


$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});




