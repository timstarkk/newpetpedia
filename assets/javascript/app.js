let type = "";
let city = "";
let state = "";
let breed = "";

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
    })

    $('#search-button').click(function (event) {
        event.preventDefault();
        city = $('#city').val().trim();
        state = $('#state').val();
        breed = $('#breed').val();

        var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

        pf.animal.search({ type: type, breed: breed, location: `${city}, ${state}` })
            .then(function (response) {
                console.log(response)

                for (i = 0; i < response.data.animals.length; i++) {

                    // console.log(response.data.animals[0].photos[0].small);


                    $('.mainRow').append(`<div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 resultBox" id="${resultIds[i]}">

                    <img src="" alt="${response.data.animals[0].photos[0].small}"></img>


                    </div>`)
                }
            })
            .catch(function (error) {
                // Handle the error
            });

    })
})