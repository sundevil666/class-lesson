import '../css/style.css';
import '../plugins';
import locations from './store/locations';
import formUI from '../views/form';
import ticketsUI from '../views/tickets';
import currencyUI from '../views/currency'

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUI.form

//  events
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  })

//  handler
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList)
  }

  async function onFormSubmit() {
  //  собираем данные из импутов
    const origin = locations.getCityCodeByKey(formUI.originValue)
    const destination = locations.getCityCodeByKey(formUI.destinationValue)
    const depart_date = formUI.departDateValue
    const return_date = formUI.returnDateValue
    const currency = currencyUI.currencyValue

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });

    ticketsUI.renderTickets(locations.lastSearch)
  }
})
