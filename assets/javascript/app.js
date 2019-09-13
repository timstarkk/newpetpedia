let type = "";
let city = "";
let state = "";
let breed = "";

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

        console.log(type, city, state, breed);

        var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

        pf.animal.search({ type: type, breed: breed, location: `${city}, ${state}` })
            .then(function (response) {
                console.log(response)

            })
            .catch(function (error) {
                // Handle the error
            });

    })
})