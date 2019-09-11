var data = {
    "grant_type": "client_credentials",
    "client_id": "qdbZnyx35Eucht2eGTONDw6UlgjtwO2EoSp8u8ZSBwGurYa2ba",
    "client_secret": "JAVzjeOIao4gdrvMT4tQUDUGh1Lu06XGTw9HWYwn"
};

// var url = "https://api.petfinder.com/v2/oauth2/qdbZnyx35Eucht2eGTONDw6UlgjtwO2EoSp8u8ZSBwGurYa2ba"
// var url = "https://cors.io/?http://https://api.petfinder.com/v2/animals"
var url = "https://api.petfinder.com/v2/animals"

function callPetfinder() {
    $.ajax({
        url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "GET",
    }).then(function (response) {
        data = response.data;
        console.log(data);
    })
}

callPetfinder();