// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4; //same as hardhat.config.js

import 'hardhat/console.sol'; // This allow you to use console.log

contract TipJar {
	uint256 public totalTips; // an integer public variable

	address payable owner; // identify the owner (the address) of the contract

	/*
	 * Store the "Tip" data in a structure
	 * the struct allow you to create a custom datatype
	 */
	struct Tip {
		address sender; //The person who gives you the tip
		string message; //A message from the sender;
		string name; //THe name of the sender
		uint256 timestamp; //When the tip was sent
		uint256 amount; //the amount of ether sent to you
	}
	/*
    store an array of structs to hold all the tips sent
    */
	Tip[] tips;

	constructor() {
		owner = payable(msg.sender); // set the contract createor based in who instantitiated it
	}
}
