// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4; //same as hardhat.config.js

import 'hardhat/console.sol'; // This allow you to use console.log

contract TipJar {
	uint256 public totalTips; // store the number of the tips received;

	constructor() {
		console.log('Tip Jar Smart Contract');
	}
}
