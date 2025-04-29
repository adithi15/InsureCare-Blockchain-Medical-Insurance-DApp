// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract MedicalInsuranceSystem {
    enum ClaimStatus { Pending, Approved, Rejected }

    struct Policy {
        address policyHolder;
        string patientName;
        uint256 premiumPaid;
        uint256 policyStart;
        uint256 policyEnd;
        bool active;
    }

    struct Claim {
        uint256 policyId;
        string treatmentDetails;
        string documentHash;
        ClaimStatus status;
        string adminRemark;
    }

    address public admin;
    uint256 public policyCounter;
    uint256 public claimCounter;

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256[]) public userClaims;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyPolicyHolder(uint256 _policyId) {
        require(policies[_policyId].policyHolder == msg.sender, "Not the policy holder");
        _;
    }

    function registerPolicy(string memory _patientName, uint256 _validityInDays) public payable {
        require(msg.value > 0, "Premium must be paid");

        uint256 start = block.timestamp;
        uint256 end = start + (_validityInDays * 1 days);

        policies[policyCounter] = Policy(msg.sender, _patientName, msg.value, start, end, true);
        userPolicies[msg.sender].push(policyCounter);
        policyCounter++;
    }

    function fileClaim(uint256 _policyId, string memory _treatmentDetails, string memory _documentHash) public onlyPolicyHolder(_policyId) {
        Policy memory policy = policies[_policyId];
        require(policy.active, "Policy is inactive");
        require(block.timestamp <= policy.policyEnd, "Policy has expired");

        claims[claimCounter] = Claim(_policyId, _treatmentDetails, _documentHash, ClaimStatus.Pending, "");
        userClaims[msg.sender].push(claimCounter);
        claimCounter++;
    }

    function reviewClaim(uint256 _claimId, bool approve, string memory remark) public onlyAdmin {
        require(_claimId < claimCounter, "Invalid claim ID");

        Claim storage claim = claims[_claimId];
        claim.status = approve ? ClaimStatus.Approved : ClaimStatus.Rejected;
        claim.adminRemark = remark;
    }

    function getMyPolicies() public view returns (uint256[] memory) {
        return userPolicies[msg.sender];
    }

    function getMyClaims() public view returns (uint256[] memory) {
        return userClaims[msg.sender];
    }
}
