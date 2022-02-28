import api from '../services/apiService';
import { formatDate } from '../heplers/date';

export class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.lastSearch = {};
    this.shortCitiesList = null;
    this.airlines = {};
    this.formateDate = helpers.formatDate
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airLines()
    ])
    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines)
    console.log(this.airlines);
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(item => item.full_name === key)
    return city.code
  }

  getCityNameByCode(code) {
    return this.cities[code].name
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : ''
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : ''
  }


  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc
    }, {})
  }

  serializeCountries(countries) {
  //  { 'Country code': {...} }
    if(!Array.isArray(countries) || !countries.length) return {}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc
    }, {})

  }

  serializeCities(cities) {
  //  { 'City name, Country name': {...} }
    return cities.reduce((acc, city) => {
      const countryName = this.getCountryNameByCode(city.country_code)
      const cityName = city.name || city.name_translations.en
      const full_name = `${cityName}, ${countryName}`
      acc[city.code] = {
        ...city,
        countryName,
        full_name
      };
      return acc
    }, {})
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item
      return acc
    }, {})
  }

  getCountryNameByCode(code) {
    return this.countries[code].name
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params)
    this.lastSearch = this.serializeTickets(response.data)
    console.log(this.lastSearch);
  }

  serializeTickets(tickets) {
    return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formateDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        return_at: this.formateDate(ticket.return_at, 'dd MMM yyyy hh:mm')
      };
    });
  }
}

const locations = new Locations(api, { formatDate });

export default locations;
