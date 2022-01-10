// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4; //same as hardhat.config.js

import 'hardhat/console.sol'; // This allow you to use console.log

contract TipJar {
	uint256 totalTips; // store the number of the tips received;

	address payable owner; //owner of the contract

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

	/*
	 * Solidity magic, this defines an Event that can be trigger and sent to the clients
	 * it will hold the address that trigger the event and will index that to allow for future search
	 * it can also hold more information,. in this case the message, name and amount same as the struct above
	 */
	event NewTip(address indexed from, string message, string name, uint256 amount);

	constructor() {
		owner = payable(msg.sender); // set the contract creator based in who instantiated it
	}

	/*
	 * public funtion (like a getter) that returns the total number of tips
	 * is marked as public and as a view, meaning that only reads from the blockchain so is gas free
	 * In a function you should declare what it returns
	 */
	function getTotalTips() public view returns (uint256) {
		return totalTips;
	}

	function sendTip(string memory _message, string memory _name) public payable {
		// Check sender balance to be more thant the amount that they want to transfer
		require(msg.sender.balance >= msg.value, "You don't have enough eth to send");
		(bool success, ) = owner.call{value: msg.value}(''); // send the amount of eth to the owner of the contract
		require(success, 'Failed to send the money'); // Check that the transfer was successful, if not trigger an error message
		totalTips += 1; //increase the amount of tips
		tips.push(Tip(msg.sender, _message, _name, block.timestamp, msg.value)); // Store the tip

		// send the event
		emit NewTip(msg.sender, _message, _name, msg.value);
	}

	/*
	 * a function that give access to the stored tips struct
	 * is just read from the blockchain so is marked as view
	 */
	function getAllTips() public view returns (Tip[] memory) {
		return tips;
	}
}
