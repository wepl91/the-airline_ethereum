// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Airline {

  address public owner;
  struct Customer {
    uint loyaltyPoints;
    uint totalFlights;
  }
  struct Flight {
    string name;
    uint price; //In wei
  }
  Flight[] public flights;
  uint etherPerPoint = 0.5 ether;
  mapping(address => Customer) public customers;
  mapping(address => Flight[]) public customerFlights;
  mapping(address => uint) public customerTotalFlights;

  event flightPurchased(address indexed customer, uint price);

  constructor() {
    owner = msg.sender;
    flights.push(Flight('Tokio', 4 ether));
    flights.push(Flight('Germany', 1 ether));
    flights.push(Flight('Madrid', 2 ether));
  }

  modifier isOwner() {
    require(msg.sender == owner);
    _;
  }

  function buyFlight(uint flightIndex) public payable {
    Flight memory flight = flights[flightIndex];
    require(msg.value == flight.price);

    Customer storage customer = customers[msg.sender];
    customer.loyaltyPoints += 5;
    customer.totalFlights += 1;
    customerFlights[msg.sender].push(flight);
    customerTotalFlights[msg.sender] ++;

    emit flightPurchased(msg.sender, flight.price);
  }

  function getTotalFlights() public view returns (uint) {
    return flights.length;
  }

  function redeemLoyaltyPoints() public {
    Customer storage customer = customers[msg.sender];
    uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
    payable(msg.sender).transfer(etherToRefund);
    customer.loyaltyPoints = 0;
  }

  function getAirlineBalance() public isOwner view returns (uint) {
    return address(this).balance;
  }

  function getRefundableEther() public view returns (uint) {
    return etherPerPoint * customers[msg.sender].loyaltyPoints;
  }
}