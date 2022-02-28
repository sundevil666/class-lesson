import locationsInstance, { Locations } from '../locations'
import { formatDate } from '../../heplers/date';
import api, { Api } from '../../services/apiService';
import apiService from '../../services/apiService';

const countries = [{ code: 'UKR', name: 'Ukraine' }]
const cities = [{ country_code: 'UKR', name: 'Kharkiv', code: 'KH'}]
const airlines = [{ country_code: 'UKR', name: 'AirLines', code: 'AVIA' }]

jest.mock('../../services/apiService', () => {
  const mockApi = {
    countries: jest.fn(() => Promise.resolve([{ code: 'UKR', name: 'Ukraine' }])),
    cities: jest.fn(() => Promise.resolve([{ country_code: 'UKR', name: 'Kharkiv', code: 'KH'}])),
    airlines: jest.fn(() => Promise.resolve([{ country_code: 'UKR', name: 'AirLines', code: 'AVIA' }]))
  }
  return {
    Api: jest.fn(() => mockApi)
  }
})

describe('Locations store tests', () => {
  beforeEach(() => {
    locationsInstance.countries = locationsInstance.serializeCountries(countries)
    locationsInstance.cities = locationsInstance.serializeCountries(cities)
  })
  it('Check that locationsInstance is instance of Locations class', () => {
    expect(locationsInstance).toBeInstanceOf(Locations)
  })
  it('Success Locations instance create', () => {
    const instance = new Locations(api, { formatDate })
    expect(instance.countries).toBe(null)
    expect(instance.shortCitiesList).toBe(null)
    expect(instance.lastSearch).toEqual({})
    expect(instance.formateDate).toEqual(formatDate)
  })

  it('Check correct countries serialize', () => {
    const res = locationsInstance.serializeCountries(countries)
    const expectedData = {
      UKR: { code: 'UKR', name: 'Ukraine' }
    }
    expect(res).toEqual(expectedData)
  })

  it('Check countries serialize with incorrect data', () => {
    const res = locationsInstance.serializeCountries(null)
    const expectedData = {}
    expect(res).toEqual(expectedData)
  })

  it('Check correct cities serialize', () => {
    const res = locationsInstance.serializeCities(cities)
    const expectDate = {
      KH:
        { country_code: 'UKR', name: 'Kharkiv', code: 'KH', countryName: 'Ukraine', full_name: 'Kharkiv, Ukraine'}
    }
    expect(res).toEqual(expectDate)
  })

  it('Check correct get city name by code', () => {
    const res = locationsInstance.getCityNameByCode('KH')
    expect(res).toBe('Kharkiv')
  })

  it('Check correct init method call', () => {
    const instance = new Locations(apiService, { formatDate })
    expect(instance.init()).resolves.toEqual([countries, cities, airlines])
  })
})
