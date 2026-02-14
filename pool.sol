// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PoolGame is Ownable, ReentrancyGuard {
    uint256 public entryFee;
    uint256 public constant POOL_SIZE = 5;
    uint256 public constant ADMIN_FEE_PERCENT = 10;
    address public ADMIN_WALLET;

    address[] public queue;
    uint256 public roundId;
    uint256 public count;


    mapping(address => uint256) public balances;

    event Joined(address indexed user, uint256 indexed roundId);
    event WinnerSelected(
        address indexed winner,
        uint256 winnerAmount,
        uint256 adminFee,
        uint256 indexed roundId
    );
    event EntryFeeUpdated(uint256 newFee);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(uint256 _entryFee, address _admin) Ownable(msg.sender) {
        require(_entryFee > 0, "Invalid entry fee");
        entryFee = _entryFee;
        ADMIN_WALLET = _admin;
        roundId = 1;
    }

    function joinPool() external payable {
    require(msg.value >= entryFee, "Invalid entry fee");

    queue.push(msg.sender);
    emit Joined(msg.sender, roundId);

    count++;

    if (count == POOL_SIZE) {
        _selectWinner();
    }
}

    function _selectWinner() internal {
    address winner = queue[0];

    uint256 totalPool = entryFee * POOL_SIZE;
    uint256 adminFee = (totalPool * ADMIN_FEE_PERCENT) / 100;
    uint256 winnerAmount = totalPool - adminFee;

    for (uint256 i = 0; i < queue.length - 1; i++) {
        queue[i] = queue[i + 1];
    }
    queue.pop();

    balances[winner] += winnerAmount;
    balances[ADMIN_WALLET] += adminFee;

    emit WinnerSelected(winner, winnerAmount, adminFee, roundId);

    count = 0;
    roundId++;
}

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");

        emit Withdrawn(msg.sender, amount);
    }


    function setEntryFee(uint256 _newFee) external onlyOwner {
        require(_newFee > 0, "Fee must be > 0");
        entryFee = _newFee;
        emit EntryFeeUpdated(_newFee);
    }

    function setAdminWallet(address _newAdmin) external onlyOwner {
    require(_newAdmin != address(0), "Invalid admin");
    ADMIN_WALLET = _newAdmin;
}


    function getQueue() external view returns (address[] memory) {
        return queue;
    }

    function poolLength() external view returns (uint256) {
        return count;
    }
}
