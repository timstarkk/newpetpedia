let type = "";
let city = "";
let state = "";
let breed = "";
let apiResponse = {};
let selectedAnimal = {};

const resultIds = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']

$(document).ready(function () {
    $('.search').click(function (event) {
        event.preventDefault();
        type = this.id;
        $('#breed').html(`<option selected>Choose...</option>`);

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

        var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

        pf.animal.search({ type: type, breed: breed, location: `${city}, ${state}` })
            .then(function (response) {
                console.log(response)
                apiResponse = response;
                for (i = 0; i < response.data.animals.length; i++) {



                    $('.mainRow').append(`<div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 resultBox" id="${resultIds[i]}">

                    <div class="row">
                    <div class="col-12 center">
                    <a href="profile.html" class="petLink">
                    <img class="petPic" src="${response.data.animals[i].photos[0].medium}" alt="" id="${i}"></img>
                    </a>
                    </div>

                        <div class="col-12 center">
                            <p>${response.data.animals[i].name}</p>
                        </div>

                    </div>
                    </div> `)
                }
            })
            .catch(function (error) {
                // Handle the error
            });

    });

    $(document).on('click', '.petLink', function (event) {
        selectedAnimal = apiResponse.data.animals[this.id];
        console.log(apiResponse.data.animals[this.id]);
    });
})