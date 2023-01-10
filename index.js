import * as dotenv from 'dotenv'

import { leerInput,inquirerMenu, pausa,listPlaces } from "./helpers/inquirer.js";
import { Searches } from "./models/searches.js";

const main = async() => {
    const searches = new Searches();
    console.log(dotenv.config())
    let opt = '';
    
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const place = await leerInput('City: ')
                const places = await searches.city(place);
                const idSelected = await listPlaces(places);
                if (idSelected === '0') continue;
                const placeSelected = places.find(l => l.id === idSelected);
                searches.addHistory(placeSelected.name);
                const weather = await searches.cityWeather(placeSelected.lat,placeSelected.lng);
                console.clear()
                console.log('\n About the City\n'.green);
                console.log('City: ',placeSelected.name);
                console.log('Lat: ',placeSelected.lat);
                console.log('Lng: ',placeSelected.lng);
                console.log('Temperature: ',weather.temp);
                console.log('Weather: ',weather.desc.green);
                console.log('Min: ',weather.min);
                console.log('MAx: ',weather.max);
                break;
            case 2:
                searches.HistoryUpperCase.forEach((place, i)=>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${place}`)
                });
                break;
        }
        if (opt !== 0 ) await pausa();
    } while (opt !== 0 );
    //await pausa();
}

main();