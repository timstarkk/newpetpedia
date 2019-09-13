$(document).ready(function () {
    $('#search-button').click(function (event) {
        event.preventDefault();

        var pf = new petfinder.Client({ apiKey: "DEEgmJQqmtdmPQKmF6fVKXW9EzOjUR4EBMkSkX5DqyapJ1keTP", secret: "Aa7kiPZFw71Z5YWnOUosFbNtXvPaELvcbV0t6On2" });

        pf.animal.search()
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                // Handle the error
            });

    })
})