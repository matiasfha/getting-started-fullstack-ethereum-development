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

	// Functions

	/*
	 * public funtion (like a getter) that returns the total number of tips
	 * is marked as public and as a view, meaning that only reads from the blockchain so is gas free
	 * In a function you should declare what it returns
	 */
	function getTotalTips() public view returns (uint256) {
		return totalTips;
	}

	function sendTip(string memory _message, string memory _name) public payable {
		require(msg.sender.balance >= msg.value, "You don't have enough funds"); // require that the sender has enough ether to send
		(bool success, ) = owner.call{value: msg.value}(''); // send the amount of eth specified in msg.value and set the gast limit to 2000 units
		require(success, 'Transfer failed'); // Check that the transfer was successful, if not trigger an error message
		totalTips += 1; //increase the amount of tips
		tips.push(Tip(msg.sender, _message, _name, block.timestamp, msg.value)); // Store the tip
	}

	/*
	 * a function that give access to the stored tips struct
	 * is just read from the blockchain so is marked as view
	 */
	function getAllTips() public view returns (Tip[] memory) {
		return tips;
	}
}
