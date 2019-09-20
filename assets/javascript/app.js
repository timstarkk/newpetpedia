let type = "";
let city = "";
let state = "";
let breed = "";
let apiResponse = {};
let selectedAnimal = {};

const resultIds = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']

// Config for Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAk4d22ZQPdMDIPGPVIFbMVC7Z0DA4Vz6U",
    authDomain: "pet-a-pedia.firebaseapp.com",
    databaseURL: "https://pet-a-pedia.firebaseio.com",
    projectId: "pet-a-pedia",
    storageBucket: "pet-a-pedia.appspot.com",
    messagingSenderId: "299646572010",
    appId: "1:299646572010:web:b52b998d7a0a03501e8e93"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Store Database Variable for firebase
const database = firebase.database();
const root = database.ref();
var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

$(document).ready(function () {
    // profile profile profile profile profile profile profile profile profile profile profile 
    if (window.location.href.substr(window.location.href.length - 12) === 'profile.html') {
        root.once("value")
            .then(function (snapshot) {
                console.log(snapshot.val().mostRecentAnimal.selectedAnimal)
                $('#main').append(`
                <div class="row center">
                <h1>${snapshot.val().mostRecentAnimal.selectedAnimal.name}</h1>
                </div>

                <div class="row infoRow">

                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 center">
                <img src="${snapshot.val().mostRecentAnimal.selectedAnimal.photos[0].medium}">
                </img>
                </div>
                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 center">
                <div class="row">
                <div class="col-12 center">
                <h5>Details: </h5>
                </div>
                <div class="col-12 center">
                <p>
                Gender: ${snapshot.val().mostRecentAnimal.selectedAnimal.gender}<br>
                Size: ${snapshot.val().mostRecentAnimal.selectedAnimal.size}<br>
                Status: ${snapshot.val().mostRecentAnimal.selectedAnimal.status}
                </p>
                </div>



                <div class="col-12 center">
                <h5>contact:</h5>
                </div>
                <div class="col-12 center">
                <p>
                Address: <br>${snapshot.val().mostRecentAnimal.selectedAnimal.contact.address.address1} ${snapshot.val().mostRecentAnimal.selectedAnimal.contact.address.city},${snapshot.val().mostRecentAnimal.selectedAnimal.contact.address.state} ${snapshot.val().mostRecentAnimal.selectedAnimal.contact.address.postcode}<br><br>
                Email: ${snapshot.val().mostRecentAnimal.selectedAnimal.contact.email}<br><br>
                Phone: ${snapshot.val().mostRecentAnimal.selectedAnimal.contact.phone}
                
                </p>
                </div>
                </div>
                </div>

                </div>
                `)
            });

        // Wikipeida specific page id that uniquely identifies each wiki page.
        let pageID;

        // The animal that will be searched for.
        root.once("value")
            .then(function (snapshot) {
                breed = snapshot.val().mostRecentAnimal.selectedAnimal.breeds.primary;
                type = snapshot.val().mostRecentAnimal.selectedAnimal.type;
                // Wiki API search query that will query 'breed' to get all the wiki pages that are similar to 'breed'.
                let queryURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + breed + " " + type + "&origin=*";

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    // Set 'pageID' to the first element in the JSON array since the first element will most likely be the one we want.
                    console.log(response)
                    pageID = response.query.search[0].pageid;


                    // Iterate the JSON array for search results that contain 'dog' or 'cat' and prioritize those instead.
                    // This will help to account for search terms like 'boxer' that wikipedia might mistake for the boxing sport instead of the dog.
                    // for (let i = 0; i < response.query.search.length; i++) {
                    //     if (response.query.search[i].title.indexOf("dog") != -1 || response.query.search[i].title.indexOf("cat") != -1) {
                    //         pageID = response.query.search[i].pageid;
                    //         break;
                    //     }
                    // }

                }).then(function () {
                    // Wiki API search query that will query the 'pageID' acquired in the previous
                    // API call for the purpose of retrieving the raw HTML of that wiki page.
                    let queryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=" + pageID + "&origin=*";
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        // All of the raw HTML from the wiki page stored in the form of a string.
                        console.log(response);

                        function animalDescription() {
                            let wikiHTMLString = response.parse.text['*'];
                            // The string index of the beginning of the wiki infobox in the wiki HTML.
                            // I just happened to notice the infobox always comes before the beginning of the description in Wikipedia HTML,
                            // so this is how I'm skipping over the infobox to get to the description.
                            let infoBoxBeginning = wikiHTMLString.indexOf("infobox");

                            // The string index of the end of the wiki infobox in the wiki HTML.
                            let infoBoxEnd = wikiHTMLString.indexOf("</table", infoBoxBeginning);

                            // The string index of the beginning of the wiki description of the animal we searched for..
                            let animalDescriptionBeginning = wikiHTMLString.indexOf("<p>", infoBoxEnd);

                            console.log(animalDescriptionBeginning)
                            // Initialize the animal description to 'null'.
                            let animalDescription = "";

                            // Start the iterator at the beginning of the wiki animal description, and traverse the HTML until the end.
                            for (i = animalDescriptionBeginning; i < wikiHTMLString.length; i++) {
                                // When you encounter a new 'div' element on the wiki page, you have reached the end of the intro animal description.
                                if (wikiHTMLString.substring(i, i + 2) == "<d") {
                                    break;
                                }
                                // If you have not encountered a new 'div' element, then just keep adding HTML characters to 'animalDescription'.
                                animalDescription += wikiHTMLString[i];
                            }
                            // There must already be an existing 'div' element with an ID named '#wikitext'.
                            $("#wikitext").append(`<h4>Breed Description</h4>`);
                            $("#wikitext").append(animalDescription);
                        }
                        animalDescription();
                    });
                }).then(function () {
                    // Wiki API search query that will query the 'pageID' acquired in the previous
                    // API call for the purpose of retrieving the raw HTML of that wiki page.
                    let queryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=" + pageID + "&origin=*";
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        // All of the raw HTML from the wiki page stored in the form of a string.
                        console.log(response);

                        function temperament() {
                            let wikiHTMLString = response.parse.text['*'];
                            let temperamentStart = wikiHTMLString.indexOf(`id="Temperament"`);
                            temperamentStart = wikiHTMLString.indexOf(`<p>`, temperamentStart);

                            console.log(temperamentStart);
                            // Initialize the animal description to 'null'.
                            let temperament = "";

                            for (i = temperamentStart; i < wikiHTMLString.length; i++) {
                                if (wikiHTMLString.substring(i, i + 3) == "</p") {
                                    if (wikiHTMLString.substring(i + 4, i + 7) !== "<p>") {
                                        break;
                                    }
                                }
                                temperament += wikiHTMLString[i];
                            }


                            // There must already be an existing 'div' element with an ID named '#wikitext'.
                            $("#wikitext").append(`<h4>Temperment</h4>`)
                            $("#wikitext").append(temperament);
                        }
                        temperament();
                    });
                }).then(function () {
                    // Wiki API search query that will query the 'pageID' acquired in the previous
                    // API call for the purpose of retrieving the raw HTML of that wiki page.
                    let queryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=" + pageID + "&origin=*";
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        // All of the raw HTML from the wiki page stored in the form of a string.
                        console.log(response);

                        function getHealth() {
                            let wikiHTMLString = response.parse.text['*'];
                            let healthStart = wikiHTMLString.indexOf(`id="Health"`);
                            healthStart = wikiHTMLString.indexOf(`<p>`, healthStart);

                            console.log(healthStart);
                            // Initialize the animal description to 'null'.
                            let healthSection = "";

                            for (i = healthStart; i < wikiHTMLString.length; i++) {
                                if (wikiHTMLString.substring(i, i + 3) == "</p") {
                                    if (wikiHTMLString.substring(i + 4, i + 7) !== "<p>") {
                                        break;
                                    }
                                }
                                healthSection += wikiHTMLString[i];
                            }


                            // There must already be an existing 'div' element with an ID named '#wikitext'.
                            $("#wikitext").append(`<h4>Health</h4>`)
                            $("#wikitext").append(healthSection);
                        }
                        getHealth();
                    });
                })


            });
    }

    // the DOG CAT OTHER buttons at the top
    $('.search').click(function (event) {
        event.preventDefault();
        type = this.id;
        $('#breed').html(`<option selected>Choose...</option>`);
        $('#dog').removeClass('enabled');
        $('#cat').removeClass('enabled');
        $('#other').removeClass('enabled');
        $(`#${type}`).addClass('enabled');

        var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

        pf.animalData.breeds(`${type}`)
            .then(response => {
                console.log(response);

                for (i = 0; i < response.data.breeds.length; i++) {

                    $('#breed').append(`<option>${response.data.breeds[i].name}</option>`)
                }
            });
    });

    $('#search-button').click(function (event) {
        event.preventDefault();
        city = $('#city').val().trim();
        state = $('#state').val();
        breed = $('#breed').val();

        pf.animal.search({ type: type, breed: breed, location: `${city}, ${state}` })
            .then(function (response) {
                const { data } = response
                const { animals } = data;
                console.log(animals)
                apiResponse = response;
                for (i = 0; i < animals.length; i++) {
                    console.warn('new pop', animals[i], i);
                    let imgUrl;
                    if (animals[i].photos.length) {
                        imgUrl = animals[i].photos && animals[i].photos[0].medium ? animals[i].photos[0].medium : animals[i].photos[0].small;
                    } else {
                        imgUrl = '';
                    }
                    $('.mainRow').append(`
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 resultBox" id="${resultIds[i]}">
                        <div class="row">
                            <div class="col-12 center">
                                <img class="petPic" src="${imgUrl}" alt="" id="${i}" />
                            </div>
                            <div class="col-12 center">
                                <p>${animals[i].name}</p>
                            </div>
                        </div>
                    </div> `);
                }
            })
            .catch(function (error) {
                // Handle the error
                console.warn('we broke the shit', error);
            });

    });

    $(document).on('click', '.petPic', function (event) {
        selectedAnimal = apiResponse.data.animals[this.id];
        console.log(apiResponse.data.animals[this.id]);

        root.set({
            mostRecentAnimal: { selectedAnimal },
        })

        window.location.href = 'profile.html'
    });


})