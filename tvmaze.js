"use strict";

const TV_MAZE_BASE_URL = "http://api.tvmaze.com/";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/** Given a show query, get from API and return (promise) array of shows:
 *      { id, name, summary, image }
 */
async function getShowsByTerm(searchQuery) {
  // make request
  const response = await axios.get(`${TV_MAZE_BASE_URL}search/shows`, {
    params: { q: searchQuery },
  });

  const prunedShows = response.data.map((showData) => {
    //why do we need .data here? not visible in Insom

    const placeholderImg = // Could be a global const
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    let show = {
      id: showData.show.id,
      name: showData.show.name,
      summary: showData.show.summary,
      image: showData.show.image ? showData.show.image.medium : placeholderImg,
    };

    return show;
  });

  return prunedShows;
}

/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
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
             <section id="${show.id}-epArea">
             <ul id="${show.id}-epList">
             </ul>
             </section>
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
  // calls our function for adding event listener to episode buttons
  addEpisodesButtonListener();
});

// event listener on episodes  -- pass the id of the

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`${TV_MAZE_BASE_URL}shows/${id}/episodes`);

  // response.data
  // map
  // name: epData.name
  // season: epData.season
  // number: epData.number


  const prunedEpisodes = response.data.map((epData) => {
    return {
      name: epData.name,
      season: epData.season,
      number: epData.number,
    };
  });
  return prunedEpisodes;
}
  // return [
  //   {id: 1234, name: "Pilot", season: "1", number: "1"},
  //   {id: 3434, name: "In the Beginning", season: "1", number: "2"},
  //   /* and so on... */
  // ]


// jquery.parents("div [data-show-id=id]") --  nth parent option
// attr([data-show-id=`${id}`])


//TODO: START HERE

// buton function
// after wards controller fx


// if (episode display: inline)

function addEpisodesButtonListener () {
  $(".Show-getEpisodes").on("click", handleEpisodesClick)
}

async function handleEpisodesClick (evt) {
  console.log("I'm clicked");
  const $button = $(evt.target);
  // get the id of the show from the closest div data-show-id
  const $showID = $button.closest(".Show").data("show-id");
  console.log($showID);
  // call episodes of show with id
  const episodes = await getEpisodesOfShow($showID);
  // call populate shows with the array of episodes
  populateEpisodes(episodes, $showID);
}



  // const $button =  $(evt.target);
  // console.log($button)
  //
  // console.log('showID', $showID);
  // await populateShows;



// let $button = $('button');
// $button.on("click", function(evt){
//   const epButton = $(evt.target);
//   console.log(epButton);
// })



/** Write a clear docstring for this function... */

function populateEpisodes(episodes, id) {
  const $currEpList = $(`#${id}-epList`);
  const $currEpArea = $(`#${id}-epArea`);
  for (let episode of episodes) {
    // console.log(episode);
    const epi = `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`;
    console.log(epi);
   $currEpList.append(epi);
  }
  $currEpArea.show().css("display", "block"); //better here or in on("click")?;
}


