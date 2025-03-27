// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComplexContract {
    struct UserInfo {
        string name;
        uint256 age;
        address wallet;
        bool isActive;
    }

    mapping(address => UserInfo) public users;
    mapping(address => uint256[]) public userScores;

    event UserRegistered(address indexed user, string name, uint256 age);
    event ScoreAdded(address indexed user, uint256 score, uint256 timestamp);
    event UserUpdated(address indexed user, UserInfo oldInfo, UserInfo newInfo);

    function registerUser(string memory name, uint256 age) public {
        require(users[msg.sender].wallet == address(0), "User already registered");
        
        UserInfo memory newUser = UserInfo({
            name: name,
            age: age,
            wallet: msg.sender,
            isActive: true
        });
        
        users[msg.sender] = newUser;
        emit UserRegistered(msg.sender, name, age);
    }

    function addScore(uint256 score) public {
        require(users[msg.sender].isActive, "User not registered or not active");
        userScores[msg.sender].push(score);
        emit ScoreAdded(msg.sender, score, block.timestamp);
    }

    function updateUser(string memory newName, uint256 newAge) public {
        require(users[msg.sender].wallet != address(0), "User not registered");
        
        UserInfo memory oldInfo = users[msg.sender];
        UserInfo memory newInfo = UserInfo({
            name: newName,
            age: newAge,
            wallet: msg.sender,
            isActive: true
        });
        
        users[msg.sender] = newInfo;
        emit UserUpdated(msg.sender, oldInfo, newInfo);
    }

    function getUserScores(address user) public view returns (uint256[] memory) {
        return userScores[user];
    }

    function getUserInfo(address user) public view returns (UserInfo memory) {
        return users[user];
    }
} 