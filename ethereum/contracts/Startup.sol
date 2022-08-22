// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.9;

contract StartupList{
    address payable[] public startups;

    function addMyStartup(uint minimum) public{
        address myStartup = address(new Startup(minimum, msg.sender));
        startups.push(payable(myStartup));
    }

    function getStartupList() public view returns(address payable[] memory){
        return startups;
    }
}

contract Startup{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool status;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumAmount;
    mapping(address => bool) public investors;
    uint public investorCount;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint amount, address founder) {
        manager = founder;
        minimumAmount = amount;
    }

    function invest() public payable{
        require(msg.value > minimumAmount);
        investors[msg.sender] = true;
        investorCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted(){
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.status = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];

        require(investors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    function finaliseRequest(uint index) public{
        Request storage request = requests[index];

        require(request.approvalCount > (investorCount/2));
        require(!request.status);

        payable(request.recipient).transfer(request.value);
        request.status = true;

    }

    function getSummary() public view returns(uint, uint, uint, uint, address){
        return(
            minimumAmount,
            address(this).balance,
            requests.length,
            investorCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint){
        return(requests.length);
    }

}
