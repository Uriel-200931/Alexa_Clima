/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

const API_KEY = "578d3e5ce39a59f9105e9dd4c6f5381d";


/*
temperatura en 41.38879 y 2.15899
temperatura en cuatro uno punto tres ocho ocho siete nueve y dos punto uno cinco ocho nueve nueve


temperatura en 48.85341 y 2.3488
temperatura en cuatro ocho punto ocho cinco tres cuatro uno y dos punto tres cuatro ocho ocho

GUADALAJARA
temperatura en 20.6593 y -103.3502
temperatura en dos cero punto seis cinco nueve tres y menos uno cero tres punto tres cinco cero dos
SAN LUIS POTOSI
temperatura en 22.30818272297219 y -100.90870282220793
SAN DIEGO TIJUANA
32.95684994026755, -116.97071320784468

https://api.openweathermap.org/data/2.5/weather?lat=20.659331609398212&lon=-103.350176906094&units=metric&appid=14f8a051f37ca0e76e29e814196c845f
https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
https://api.openweathermap.org/data/2.5/weather?q=puebla&appid=14f8a051f37ca0e76e29e814196c845f
https://api.openweathermap.org/data/2.5/weather?q=guadalajara,ES&appid=14f8a051f37ca0e76e29e814196c845f

*/

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = '¡Bienvenido a la skill de alumno datos temperatura!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const TemperatureIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TemperatureIntent';
  },
  async handle(handlerInput) {
    const latitude = parseFloat(handlerInput.requestEnvelope.request.intent.slots.latitude.value);
    const longitude = parseFloat(handlerInput.requestEnvelope.request.intent.slots.longitude.value);

    const weatherResponse = await getWeatherData(latitude, longitude);

    let speakOutput = '';

    if (weatherResponse) {
       const temperature = weatherResponse.main.temp;
      const tempMin = weatherResponse.main.temp_min;
      const tempMax = weatherResponse.main.temp_max;
      const city = weatherResponse.name;
      const humidity = weatherResponse.main.humidity;
      
      const weatherDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
     
      const temperatureReal = parseFloat(temperature) - 273.15;
      const tempMinn = parseFloat(tempMin) - 273.15;
      const tempMaxx = parseFloat(tempMax) - 273.15;
      const final = temperatureReal.toFixed(2);
      
 speakOutput = `La temperatura en ${city} es de ${temperature} grados Celsius. La temperatura mínima es de ${tempMin} grados Celsius y la temperatura máxima es de ${tempMax} grados Celsius. La humedad es de ${humidity}%.`;
     console.log(`Consulta esta URL en tu navegador para obtener los datos climáticos: ${weatherDataUrl}`);
      
     
     console.log(`Consulta esta URL en tu navegador para obtener los datos climáticos: ${weatherDataUrl}`);
        
    } else {
      speakOutput = 'No se pudo obtener la temperatura. Por favor, inténtalo de nuevo más tarde.';
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};


const CiudadIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CiudadIntent';
  },
  async handle(handlerInput) {
    const ciudad = handlerInput.requestEnvelope.request.intent.slots.city.value;
    const country = handlerInput.requestEnvelope.request.intent.slots.country.value;

    const weatherResponse = await getWeatherDataCity(ciudad,country);

    let speakOutput = '';

    if (weatherResponse) {
      const temperature = weatherResponse.main.temp;
      const city = weatherResponse.name;
      const humidity = weatherResponse.main.humidity;
      const latitude = weatherResponse.coord.lon;
      const longitude = weatherResponse.coord.lat;
      const tempMin = weatherResponse.main.temp_min;
      const tempMax = weatherResponse.main.temp_max;
      
      const weatherDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
     
        const temperatureReal = parseFloat(temperature) - 273.15;
      const tempMinn = parseFloat(tempMin) - 273.15;
      const tempMaxx = parseFloat(tempMax) - 273.15;
      const final = temperatureReal.toFixed(2);
      const final2 = tempMinn.toFixed(2);
      const final3 = tempMaxx.toFixed(2);
      
     speakOutput = `La temperatura en ${city} 
     es de ${final} grados Celsius. 
     La temperatura mínima es de ${final2} grados Celsius y la temperatura máxima es de ${final3} grados Celsius. La humedad es de ${humidity}%.`;
     
     console.log(`Consulta esta URL en tu navegador para obtener los datos climáticos: ${weatherDataUrl}`);
        
    } else {
      speakOutput = 'No se pudo obtener la temperatura. Por favor, inténtalo de nuevo más tarde.';
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};


const StopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Hasta la vista baby!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

function getWeatherData(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      console.error('Error al obtener los datos del clima:', error);
      return null;
    });
}

function getWeatherDataCity(ciudad,country) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${country}&appid=${API_KEY}`;

  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      console.error('Error al obtener los datos del estado:', error);
      return null;
    });
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    TemperatureIntentHandler,
    CiudadIntentHandler,
    StopIntentHandler
  )
  .lambda();