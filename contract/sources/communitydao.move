module Governance::CommunityDAO {
    use std::signer;
    use std::vector;
    use std::string;
    use std::table;
    use std::event;
    use std::error;
    use std::math;

    /// Error codes for debugging
    const EONLY_COUNCIL_MEMBERS: u64 = 100;
    const EPROPOSAL_ALREADY_EXECUTED: u64 = 101;
    const EINVALID_COMMUNITY: u64 = 102;
    const EINVALID_PROPOSAL: u64 = 103;
    const EALREADY_VOTED: u64 = 104;
    const EEMPTY_NAME: u64 = 105;
    const EEMPTY_LOGO: u64 = 106;
    const EEMPTY_DESCRIPTION: u64 = 107;
    const EONLY_COUNCIL_CAN_EXECUTE: u64 = 108;
    const EINVALID_CANDIDATE: u64 = 109;
    const EINVALID_VOTING_DEADLINE: u64 = 110;

    /// Event emitted when a new DAO (Community) is created
    struct CommunityCreatedEvent has copy, drop {
        community_id: u64,
        creator: address,
        name: string::String
    }

    /// Event emitted when a proposal is created
    struct ProposalCreatedEvent has copy, drop {
        proposal_id: u64,
        community_id: u64,
        creator: address,
        title: string::String
    }

    /// Event emitted when a vote is cast
    struct ProposalVotedEvent has copy, drop {
        proposal_id: u64,
        voter: address,
        support: bool
    }

    /// Event emitted when a proposal is executed
    struct ProposalExecutedEvent has copy, drop {
        proposal_id: u64
    }

    /// Event emitted when a council member is replaced
    struct CouncilUpdatedEvent has copy, drop {
        community_id: u64,
        old_member: address,
        new_member: address
    }

    /// Represents a DAO (Community)
    struct Community has key {
        id: u64,
        name: string::String,
        logo: string::String,
        backdrop: string::String,
        description: string::String,
        creator: address,
        councils: vector<address>, // Fixed 4 council members
        proposals: vector<u64>
    }

    /// Represents a governance proposal
    struct Proposal has key {
        id: u64,
        title: string::String,
        description: string::String,
        votes_for: u64,
        votes_against: u64,
        creator: address,
        executed: bool,
        voters: vector<address>,
        community_id: u64,
        deadline: u64  // Voting deadline (timestamp)
    }

    /// DAO Storage
    struct DAOState has key {
        communities: table::Table<u64, Community>,
        community_count: u64
    }

    /// Proposal Storage
    struct ProposalState has key {
        proposals: table::Table<u64, Proposal>,
        proposal_count: u64
    }

    /// Initializes the DAO governance system
    public entry fun initialize_governance(admin: &signer) {
        let dao_state = DAOState {
            communities: table::new<u64, Community>(),
            community_count: 0
        };
        move_to<DAOState>(&signer::address_of(admin), dao_state);

        let proposal_state = ProposalState {
            proposals: table::new<u64, Proposal>(),
            proposal_count: 0
        };
        move_to<ProposalState>(&signer::address_of(admin), proposal_state);
    }

    /// Checks if a user is a council member
    fun is_council_member(community: &Community, user: address): bool {
        vector::contains(&community.councils, user)
    }

    /// Allows a user to create a new DAO (Community) with exactly 4 council members
    public entry fun create_community(
        creator: &signer,
        name: string::String,
        logo: string::String,
        backdrop: string::String,
        description: string::String,
        council1: address,
        council2: address,
        council3: address,
        council4: address
    ) {
        let creator_addr = signer::address_of(creator);
        let dao_state = borrow_global_mut<DAOState>(signer::address_of(creator));
        let community_id = dao_state.community_count;

        assert!(!string::is_empty(&name), EEMPTY_NAME);
        assert!(!string::is_empty(&logo), EEMPTY_LOGO);
        assert!(!string::is_empty(&description), EEMPTY_DESCRIPTION);

        let councils = vector::singleton(council1);
        vector::push_back(&mut councils, council2);
        vector::push_back(&mut councils, council3);
        vector::push_back(&mut councils, council4);

        let new_community = Community {
            id: community_id,
            name,
            logo,
            backdrop,
            description,
            creator: creator_addr,
            councils,
            proposals: vector::empty<u64>()
        };

        table::add(&mut dao_state.communities, community_id, new_community);
        dao_state.community_count = dao_state.community_count + 1;

        event::emit<CommunityCreatedEvent>(&CommunityCreatedEvent {
            community_id,
            creator: creator_addr,
            name
        });
    }

    /// Allows only council members to create a proposal
    public entry fun create_proposal(
        creator: &signer,
        community_id: u64,
        title: string::String,
        description: string::String,
        deadline: u64
    ) {
        let creator_addr = signer::address_of(creator);
        let dao_state = borrow_global_mut<DAOState>(signer::address_of(creator));
        let proposal_state = borrow_global_mut<ProposalState>(signer::address_of(creator));

        let community = table::borrow_mut(&mut dao_state.communities, community_id);
        assert!(is_council_member(community, creator_addr), EONLY_COUNCIL_MEMBERS);
        assert!(deadline > 0, EINVALID_VOTING_DEADLINE);

        let proposal_id = proposal_state.proposal_count;
        let proposal = Proposal {
            id: proposal_id,
            title,
            description,
            votes_for: 0,
            votes_against: 0,
            creator: creator_addr,
            executed: false,
            voters: vector::empty<address>(),
            community_id,
            deadline
        };

        table::add(&mut proposal_state.proposals, proposal_id, proposal);
        vector::push_back(&mut community.proposals, proposal_id);
        proposal_state.proposal_count = proposal_state.proposal_count + 1;

        event::emit<ProposalCreatedEvent>(&ProposalCreatedEvent {
            proposal_id,
            community_id,
            creator: creator_addr,
            title
        });
    }

    /// Allows council members to execute a proposal
    public entry fun execute_proposal(executor: &signer, proposal_id: u64) {
        let executor_addr = signer::address_of(executor);
        let proposal_state = borrow_global_mut<ProposalState>(signer::address_of(executor));
        let proposal = table::borrow_mut(&mut proposal_state.proposals, proposal_id);

        assert!(!proposal.executed, EPROPOSAL_ALREADY_EXECUTED);

        let dao_state = borrow_global_mut<DAOState>(signer::address_of(executor));
        let community = table::borrow_mut(&mut dao_state.communities, proposal.community_id);

        assert!(is_council_member(community, executor_addr), EONLY_COUNCIL_CAN_EXECUTE);
        assert!(proposal.votes_for > proposal.votes_against, EINVALID_PROPOSAL);

        proposal.executed = true;
        event::emit<ProposalExecutedEvent>(&ProposalExecutedEvent {
            proposal_id
        });
    }
}