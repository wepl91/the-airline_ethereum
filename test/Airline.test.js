const Airline = artifacts.require('Airline');
let instance;

beforeEach(async () => {
  instance = await Airline.new();
});

contract('Airline', accounts => {
  it('Should have available flights', async () => {
    let total = await instance.getTotalFlights();
    assert(total > 0);
  });

  it('Should allow customers to buy a flight providing its value', async () => {
    let flight = await instance.flights(0);
    let flightName = flight[0], flightPrice = flight[1];
    
    await instance.buyFlight(0, { from: accounts[0], value: flightPrice });
    let customerFlight = await instance.customerFlights(accounts[0], 0);
    let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);

    assert(customerFlight[0],flightName);
    assert(customerFlight[1], flightPrice);
    assert(customerTotalFlights > 0);
  });

  it('Should not alow to buy flight under the price', async () => {
    let flight = await instance.flights(1);
    let flightPrice = flight[1] - 5000;

    try {
      await instance.buyFlight(0, { form: accounts[0], value: flightPrice });
    } catch(error) { return }
    assert.fail();
  });

  it('Should get the real balance of the contract', async () => {
    let flight = await instance.flights(0);
    let flightPrice = flight[1];
    
    let flight2 = await instance.flights(1);
    let flightPrice2 = flight2[1];

    await instance.buyFlight(0, { from: accounts[0], value: flightPrice });
    await instance.buyFlight(1, { from: accounts[0], value: flightPrice2 });

    let newAirlineBalance = await instance.getAirlineBalance();

    assert.equal(parseInt(newAirlineBalance), parseInt(parseInt(flightPrice) + parseInt(flightPrice2)));
  });

  it('Should allow customers to redeem loyalty points', async () => {
    let flight = await instance.flights(1);
    let flightPrice = flight[1];

    await instance.buyFlight(1, { from: accounts[1], value: flightPrice });
    
    let balance = await web3.eth.getBalance(accounts[1]);
    await instance.redeemLoyaltyPoints({ from: accounts[1] });
    let finalBalance = await web3.eth.getBalance(accounts[1]);

    let customer = await instance.customers(accounts[1]);
    let customerLoyaltyPoinst = customer[0];

    assert(customerLoyaltyPoinst, 0);
    assert(balance < finalBalance);
  });
});