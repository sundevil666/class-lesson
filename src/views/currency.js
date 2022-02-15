class CurrencyUI {
  constructor() {
    this.currency = document.getElementById('currency');
    this.dictionary = {
      USD: 'usd',
      EUR: 'eur'
    }
  }

  get currencyValue() {
    return this.currency.value;
  }

  getСurrencySymbol() {
    return this.dictionary[this.currencyValue]
  }
}

const currencyUI = new CurrencyUI();

export default currencyUI;
