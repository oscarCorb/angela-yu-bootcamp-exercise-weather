const { response } = require('express');
const express = require('express');
const https = require('https');

// este módulo es para recoger los datos introcidos en el formulario
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// la ruta es la del 'action' del formulario del html
app.post('/', function (req, res) {
    const query = req.body.cityName;
    const units = 'metric';
    const apiKey = 'ffab4fcaf380ca8b829c5278a58dc31f';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on('data', function (data) {
            const weatherData = JSON.parse(data);

            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            res.write(`<h1>${query}</h1>`);
            res.write(`<h2>Temperature: ${temp} degrees</h2>`);
            res.write(`<h2>Weather: ${description}</h2>`);
            res.write(`<img src="${iconUrl}" />`);
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
