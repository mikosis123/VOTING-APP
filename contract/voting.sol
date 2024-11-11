// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingproposalWTS {
    struct Proposal {
        address target;  // Address to send the call to
        bytes data;      // Data to be sent in the call
        uint yesCount;   // Number of "yes" votes
        uint noCount;    // Number of "no" votes
        bool executed;   // Whether the proposal has been executed
        bool isDeleted;  // Mark if proposal is deleted
        uint256 timestamp; // Timestamp when the proposal was created
        mapping(address => bool) hasVoted;  // Track if user has voted
        mapping(address => bool) vote;      // Track user's vote: true = yes, false = no
    }

    struct ProposalView {
        address target;
        bytes data;
        uint yesCount;
        uint noCount;
        bool executed;
        bool isDeleted;
        uint256 timestamp;  // Include timestamp in ProposalView for external access
    }

    struct Member {
        string name;
        bool isMember;
    }

    struct MemberView {
        address memberAddress;
        string name;
    }

    address public owner;
    mapping(address => Member) public members;
    address[] public memberAddresses;  // Store member addresses separately
    uint constant MINIMUM_YES_VOTES = 10;

    event ProposalCreated(uint proID, uint256 timestamp); // Add timestamp to event
    event VoteCast(uint proID, address voter);
    event ProposalExecuted(uint proID, bool success);
    event MemberAdded(address newMember, string name);
    event ProposalDeleted(uint proID);

    Proposal[] public proposals;

    constructor(address[] memory _members, string[] memory _names) {
        require(_members.length == _names.length, "Members and names count must match");
        owner = msg.sender;
        members[owner] = Member("Owner", true);  // Owner is the first member
        memberAddresses.push(owner);  // Add the owner's address to the member list

        for (uint i = 0; i < _members.length; i++) {
            members[_members[i]] = Member(_names[i], true);
            memberAddresses.push(_members[i]);  // Add each member's address to the list
        }
    }

    modifier onlyMember() {
        require(members[msg.sender].isMember, "You are not allowed to perform this action");
        _;
    }

    // Add a new proposal with a timestamp
    function NewProposal(address proposal, bytes memory data) external onlyMember {
        Proposal storage newProposal = proposals.push();
        newProposal.target = proposal;
        newProposal.data = data;
        newProposal.executed = false;
        newProposal.isDeleted = false;
        newProposal.timestamp = block.timestamp; // Set timestamp to current block time
        emit ProposalCreated(proposals.length - 1, newProposal.timestamp); // Emit timestamp in event
    }

    // Cast vote for a proposal
    function castVote(uint proID, bool vote) external onlyMember {
        require(proID < proposals.length, "Proposal does not exist");
        Proposal storage selectedProposal = proposals[proID];

        require(!selectedProposal.executed, "Proposal already executed");
        require(!selectedProposal.isDeleted, "Proposal has been deleted");

        if (selectedProposal.hasVoted[msg.sender]) {
            if (selectedProposal.vote[msg.sender]) {
                selectedProposal.yesCount--;
            } else {
                selectedProposal.noCount--;
            }
        }

        if (vote) {
            selectedProposal.yesCount++;
        } else {
            selectedProposal.noCount++;
        }

        selectedProposal.hasVoted[msg.sender] = true;
        selectedProposal.vote[msg.sender] = vote;

        emit VoteCast(proID, msg.sender);

        if (selectedProposal.yesCount >= MINIMUM_YES_VOTES) {
            executeProposal(proID);
        }
    }

    // Execute a proposal
    function executeProposal(uint proID) public {
        Proposal storage selectedProposal = proposals[proID];

        require(!selectedProposal.executed, "Proposal already executed");
        require(!selectedProposal.isDeleted, "Proposal has been deleted");

        (bool success, ) = selectedProposal.target.call(selectedProposal.data);
        selectedProposal.executed = true;

        emit ProposalExecuted(proID, success);
    }

    // Add a new member with a name
    function addMember(address _newMember, string memory _name) external {
        require(!members[_newMember].isMember, "Address is already a member");
        members[_newMember] = Member(_name, true);
        memberAddresses.push(_newMember);  // Add the new member's address to the list
        emit MemberAdded(_newMember, _name);
    }

    // Delete a proposal by marking it as deleted
    function deleteProposal(uint proID) external onlyMember {
        require(proID < proposals.length, "Proposal does not exist");
        require(!proposals[proID].isDeleted, "Proposal already deleted");

        proposals[proID].isDeleted = true;  // Mark the proposal as deleted

        emit ProposalDeleted(proID);
    }

    // View function to return proposals without mappings
    function getProposals() external view returns (ProposalView[] memory) {
        ProposalView[] memory result = new ProposalView[](proposals.length);

        for (uint i = 0; i < proposals.length; i++) {
            Proposal storage proposal = proposals[i];
            result[i] = ProposalView(
                proposal.target,
                proposal.data,
                proposal.yesCount,
                proposal.noCount,
                proposal.executed,
                proposal.isDeleted,
                proposal.timestamp  // Include timestamp in the returned view
            );
        }
        return result;
    }

    // View function to return all members as a single array of structs
    function getAllMembers() external view returns (MemberView[] memory) {
        uint memberCount = memberAddresses.length;  // Get the total number of members

        // Initialize an array of MemberView structs
        MemberView[] memory memberViews = new MemberView[](memberCount);

        // Populate the MemberView array with member addresses and names
        for (uint i = 0; i < memberCount; i++) {
            address memberAddress = memberAddresses[i];
            memberViews[i] = MemberView({
                memberAddress: memberAddress,
                name: members[memberAddress].name
            });
        }

        return memberViews;
    }
}
