var data = {
    "grant_type": "client_credentials",
    "client_id": "qdbZnyx35Eucht2eGTONDw6UlgjtwO2EoSp8u8ZSBwGurYa2ba",
    "client_secret": "JAVzjeOIao4gdrvMT4tQUDUGh1Lu06XGTw9HWYwn"
};
var url = "https://api.petfinder.com/v2/oauth2/token";
axios.get(url, data)
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });