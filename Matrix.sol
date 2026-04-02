// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Matrix is Ownable {
    struct User {
        address referrer;
        uint256 level;
        uint256 directReferrals;
        uint256 teamSize;
        uint256 withdrawable;
        uint256 totalProfit;
        uint256 lastLevelUpgradeTimestamp;
        bool registered;
    }

    mapping(address => User) public users;
    uint256 public userCount;
    
    mapping(uint256 => uint256) public teamRequirement;
    mapping(uint256 => uint256) public directRequirement;
    mapping(uint256 => uint256) public memberValue;
    mapping(uint256 => uint256) public upgradeCost;
    
    uint256 public adminBalance;
    uint256 public protectionFundBalance;
    
    uint256 constant DOLLAR = 0.002 ether;
    uint256 constant ENTRY_FEE = 15 * DOLLAR;
    uint256 constant REFERRAL_REWARD = 5 * DOLLAR;
    uint256 constant MAX_LEVEL = 8;
    
    uint256 constant INACTIVE_DURATION = 365 days;
    uint256 constant INACTIVE_CLAIM_AMOUNT = 25 * DOLLAR;
    
    event UserRegistered(address indexed user, address indexed referrer, uint256 userId);
    event LevelUpgraded(address indexed user, uint256 newLevel);
    event Withdrawn(address indexed user, uint256 amount);
    event ProfitCalculated(address indexed user, uint256 profit, uint256 adminFee, uint256 protectionFee);
    event AdminFeePaid(uint256 amount);
    event ProtectionFundIncreased(uint256 amount);
    event InactiveBenefitClaimed(address indexed user, uint256 amount);
    event AdminWithdrawn(address indexed admin, uint256 amount);

    error AlreadyRegistered();
    error InvalidEntryFee();
    error InvalidReferrer();
    error SelfReferral();
    error NotRegistered();
    error NoWithdrawableBalance();
    error UserNotInactive();
    error InsufficientProtectionFund();

    constructor() Ownable(msg.sender) {
        teamRequirement[2] = 0;
        directRequirement[2] = 2;
        
        teamRequirement[3] = 8;
        directRequirement[3] = 0;
        
        teamRequirement[4] = 16;
        directRequirement[4] = 0;
        
        teamRequirement[5] = 32;
        directRequirement[5] = 0;
        
        teamRequirement[6] = 64;
        directRequirement[6] = 10;
        
        teamRequirement[7] = 128;
        directRequirement[7] = 0;
        
        teamRequirement[8] = 256;
        directRequirement[8] = 20;
        
        memberValue[1] = 1 * DOLLAR;
        memberValue[2] = 2 * DOLLAR;
        memberValue[3] = 3 * DOLLAR;
        memberValue[4] = 4 * DOLLAR;
        memberValue[5] = 5 * DOLLAR;
        memberValue[6] = 6 * DOLLAR;
        memberValue[7] = 7 * DOLLAR;
        memberValue[8] = 8 * DOLLAR;
        
        upgradeCost[1] = 0;
        upgradeCost[2] = 20 * DOLLAR;
        upgradeCost[3] = 40 * DOLLAR;
        upgradeCost[4] = 100 * DOLLAR;
        upgradeCost[5] = 200 * DOLLAR;
        upgradeCost[6] = 400 * DOLLAR;
        upgradeCost[7] = 800 * DOLLAR;
        upgradeCost[8] = 1600 * DOLLAR;
        
        userCount = 1;
        users[msg.sender].registered = true;
        users[msg.sender].level = MAX_LEVEL;
        users[msg.sender].lastLevelUpgradeTimestamp = block.timestamp;
    }

    function register(address _referrer) external payable {
        if (users[msg.sender].registered) revert AlreadyRegistered();
        if (msg.value != ENTRY_FEE) revert InvalidEntryFee();
        if (_referrer == msg.sender) revert SelfReferral();
        
        if (_referrer != address(0) && !users[_referrer].registered) {
            revert InvalidReferrer();
        }
        
        userCount++;
        User storage user = users[msg.sender];
        user.registered = true;
        user.level = 1;
        user.referrer = _referrer;
        user.lastLevelUpgradeTimestamp = block.timestamp;
        
        emit UserRegistered(msg.sender, _referrer, userCount);
        
        if (_referrer != address(0)) {
            users[_referrer].withdrawable += REFERRAL_REWARD;
            
            users[_referrer].directReferrals++;
            
            _propagateTeamUpdate(_referrer);
        }
    }
    
    function _propagateTeamUpdate(address _user) internal {
        address current = _user;
        
        while (current != address(0) && users[current].registered) {
            users[current].teamSize++;
            
            _updateUserLevel(current);
            
            _calculateProfit(current);
            
            current = users[current].referrer;
            
            if (current == users[current].referrer) break;
        }
    }
    
    function _updateUserLevel(address _user) internal {
        User storage user = users[_user];
        uint256 currentLevel = user.level;
        
        for (uint256 nextLevel = currentLevel + 1; nextLevel <= MAX_LEVEL; nextLevel++) {
            bool directOk = user.directReferrals >= directRequirement[nextLevel];
            bool teamOk = user.teamSize >= teamRequirement[nextLevel];
            
            if (directOk && teamOk) {
                user.level = nextLevel;
                user.lastLevelUpgradeTimestamp = block.timestamp;
                emit LevelUpgraded(_user, nextLevel);
            } else {
                break;
            }
        }
    }
    
    function _calculateProfit(address _user) internal {
        User storage user = users[_user];
        
        if (user.teamSize == 0) return;
        
        uint256 level = user.level;
        uint256 teamIncome = user.teamSize * memberValue[level];
        
        if (teamIncome > upgradeCost[level]) {
            uint256 profit = teamIncome - upgradeCost[level];
            
            uint256 adminFee = (profit * 10) / 100;
            adminBalance += adminFee;
            emit AdminFeePaid(adminFee);
            
            uint256 protectionFee = (profit * 5) / 1000;
            protectionFundBalance += protectionFee;
            emit ProtectionFundIncreased(protectionFee);

            uint256 userShare = (profit * 10) / 100;
            user.withdrawable += userShare;
            user.totalProfit += profit;
            
            emit ProfitCalculated(_user, profit, adminFee, protectionFee);
        }
    }
    
    function claimInactiveBenefit() external {
        if (!users[msg.sender].registered) revert NotRegistered();
        
        if (block.timestamp - users[msg.sender].lastLevelUpgradeTimestamp < INACTIVE_DURATION) {
            revert UserNotInactive();
        }
        
        if (protectionFundBalance < INACTIVE_CLAIM_AMOUNT) {
            revert InsufficientProtectionFund();
        }
        
        protectionFundBalance -= INACTIVE_CLAIM_AMOUNT;
        
        users[msg.sender].withdrawable += INACTIVE_CLAIM_AMOUNT;
        
        users[msg.sender].lastLevelUpgradeTimestamp = block.timestamp; 
        
        emit InactiveBenefitClaimed(msg.sender, INACTIVE_CLAIM_AMOUNT);
    }

    function withdraw() external {
        if (!users[msg.sender].registered) revert NotRegistered();
        
        uint256 amount = users[msg.sender].withdrawable;
        if (amount == 0) revert NoWithdrawableBalance();
        
        users[msg.sender].withdrawable = 0;
        
        payable(msg.sender).transfer(amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function withdrawAdminBalance() external onlyOwner {
        uint256 amount = adminBalance;
        if (amount == 0) revert NoWithdrawableBalance();
        
        adminBalance = 0;
        payable(owner()).transfer(amount);
        emit AdminWithdrawn(owner(), amount);
    }

    function withdrawExcessFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit AdminWithdrawn(owner(), balance);
    }
    
    function getUserInfo(address _user) external view returns (
        address referrer,
        uint256 level,
        uint256 directReferrals,
        uint256 teamSize,
        uint256 withdrawable,
        uint256 totalProfit,
        uint256 lastUpgradeTime,
        bool registered
    ) {
        User storage user = users[_user];
        return (
            user.referrer,
            user.level,
            user.directReferrals,
            user.teamSize,
            user.withdrawable,
            user.totalProfit,
            user.lastLevelUpgradeTimestamp,
            user.registered
        );
    }

    function isUserInactive(address _user) external view returns (bool) {
         if (!users[_user].registered) return false;
         return (block.timestamp - users[_user].lastLevelUpgradeTimestamp >= INACTIVE_DURATION);
    }
    
    function getLevelRequirements(uint256 _level) external view returns (
        uint256 teamReq,
        uint256 directReq,
        uint256 value,
        uint256 cost
    ) {
        return (
            teamRequirement[_level],
            directRequirement[_level],
            memberValue[_level],
            upgradeCost[_level]
        );
    }
}
