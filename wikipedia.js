window.addEventListener('load', () => {
  registerSW();
});

$(document).ready(() => {
    $("#random").click(() => {
      return window.open("https://en.wikipedia.org/wiki/Special:Random");
    });
  
    let endpoint =
      "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
  
  
    function WikiSearch() {
      $("#search").keypress(e => {
        let searchTerm = $("#search").val();
        let key = e.which;
  
        if (key === 13) {
          $("#results").empty();
          makeRequest();
        }
  
        function makeRequest() {
          $.ajax({
            url: endpoint + searchTerm,
            dataType: "jsonp",
            type: "GET",
            headers: {
              "Api-User-Agent": "Mozilla/5.0"
            },
            success: data => {
              if (data.query === undefined) {
                $("#results").append(
                  `<div class="results-row-box">
                                          <div class="results-row-box-content">
                                              <div class="d-flex w-100 justify-content-between">
                                                  <h5 class="mb-1">Suggestions:</h5>
                                              </div>
                                              <li class="mb-1">Make sure all words are spelled correctly.</li>
                                              <li class="mb-1">Try different keywords.</li>
                                              <li class="mb-1">Try more general keywords.</li>
                                          </div>
                                  </div>`
                );
              } else {
                let articles = data.query.pages;
                for (let value of Object.values(articles)) {
                  $("#results")
                    .append(`<a href="#" onclick="window.open('https://en.wikipedia.org/?curid=${
                    value.pageid
                  }')" class="results-row-box-content">\
              <div class = "d-flex w-100 justify-content-between">\
              <h5  class = "mb-1">${value.title}</h5>\
              </div>\
              <p class="mb-1">${value.extract}</p>\
          </a>`);
                }
              }
            },
            error: errorMsg => {
              $("#results").append(
                `<li class="list-group-item list-group-item-danger">Oh no something went wrong...This is a ${
                  errorMsg.status
                } error, but we'll fix it</li>`
              );
            }
          });
        }
      });
    }
    WikiSearch();
  });

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`Service Worker registration failed`);
    }
  }
}
