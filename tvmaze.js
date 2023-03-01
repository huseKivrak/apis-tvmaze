"use strict";

const tvmazeBaseURL = "http://api.tvmaze.com/search/shows"; // TODO: further base?
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchQuery) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // make request
  const response = await axios.get(tvmazeBaseURL, {
    params: { q: searchQuery },
  });

  const prunedShows = response.data.map((showData) => {
    //why do we need .data here? not visible in Insom

    const placeholderImg =
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    let show = {
      id: showData.show.id,
      name: showData.show.name,
      summary: showData.show.summary,
      image: placeholderImg,
    };


    if (showData.show.image) {
      if (showData.show.image.medium) show.image = showData.show.image.medium;
      else if (showData.show.image.original) show.image = showData.show.image.original;
    }

    return show;
  });

  return prunedShows;
}

// || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'
/*
   map the array that returns to only have:
     return {

      id: show.id
      name: show.name
      summary: show.summary
      image: show.image.medium
    }
    */
/** Given list of shows, create markup for each and to DOM */
//get alt text?
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    console.log("show.image= ", show.image);
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
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
  // TODO: Refactor to separate function
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

// return [
//   {
//     id: 1767,  //     TODO: Make sure each show has id
//     name: "The Bletchley Circle",
//     summary:
//       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//          women with extraordinary skills that helped to end World War II.</p>
//        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//          normal lives, modestly setting aside the part they played in
//          producing crucial intelligence, which helped the Allies to victory
//          and shortened the war. When Susan discovers a hidden code behind an
//          unsolved murder she is met by skepticism from the police. She
//          quickly realises she can only begin to crack the murders and bring
//          the culprit to justice with her former friends.</p>`,
//     image:
//         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//   }
// ]
