import  * as fs from 'fs'

import axios from 'axios';


export class Searches{
    history =[];
    dbPath = './db/database.json';

    constructor(){
        this.readDB();
    }

    get paramsMapBox(){
        return{
            'limit':5,
            'language':'es',
            'access_token': process.env.MAPBOX_kEY
        }
    }

    get paramsWeather(){
        return{
            'appid':process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get HistoryUpperCase(){
        return this.history.map( lugar =>{
            let words = lugar.split(' ');
            words = words.map( w => w[0].toUpperCase() + w.substring(1));
            return words.join(' ');
        })
    }

    async city(place = ''){
        try {
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params:this.paramsMapBox
            });
            // en el .map cuando se pone =>({}) es que devuelve un nuevo objeto
            const res = await instance.get();
            return res.data.features.map(lugar =>({
                id: lugar.id,
                name:lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (error) {
            return [];
        }
    }

    async cityWeather(lat,lon){
        try {
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.paramsWeather,lat,lon}
            });
            const res = await instance.get();
            const {weather, main} = res.data;
            
            return {
                desc : weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    addHistory(place  =''){
        if (this.history.includes(place.toLocaleLowerCase())) {
            return;
        }
        this.history.unshift(place.toLocaleLowerCase());
        this.saveDB();
    }

    saveDB(){
        const payload = {
            history : this.history
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        const data = JSON.parse(info);

        this.history = data.history;
    }
}