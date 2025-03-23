// module my_addrx::Dao {
//     use std::signer;
//     use std::vector;
//     use aptos_framework::event;
//     use aptos_framework::account;

//     /// Resource struct representing a DAO
//     struct DAO has key {
//         owner: address,
//         name: vector<u8>,
//         logo: vector<u8>,
//         council: vector<address>,
//         proposals: vector<Proposal>,
//         proposal_created_events: event::EventHandle<ProposalCreated>,
//         voting_started_events: event::EventHandle<VotingStarted>,
//         vote_cast_events: event::EventHandle<VoteCast>,
//         proposal_finalized_events: event::EventHandle<ProposalFinalized>,
//     }

//     /// Struct representing a proposal
//     struct Proposal has store, copy, drop {
//         id: u64,
//         description: vector<u8>,
//         status: u8,
//         yes_voters: vector<address>,
//         no_voters: vector<address>,
//     }

//     /// Event structs
//     struct ProposalCreated has drop, store {
//         dao_owner: address,
//         proposal_id: u64,
//         description: vector<u8>,
//     }

//     struct VotingStarted has drop, store {
//         dao_owner: address,
//         proposal_id: u64,
//     }

//     struct VoteCast has drop, store {
//         dao_owner: address,
//         proposal_id: u64,
//         voter: address,
//         yes: bool,
//     }

//     struct ProposalFinalized has drop, store {
//         dao_owner: address,
//         proposal_id: u64,
//         status: u8,
//     }

//     /// Error codes
//     const E_NOT_OWNER: u64 = 0;
//     const E_DAO_ALREADY_EXISTS: u64 = 1;
//     const E_INVALID_PROPOSAL: u64 = 2;
//     const E_INVALID_STATUS: u64 = 3;
//     const E_NOT_COUNCIL_MEMBER: u64 = 4;
//     const E_ALREADY_VOTED: u64 = 5;
//     const E_DAO_NOT_FOUND: u64 = 6;

//     /// Status constants
//     const STATUS_PENDING: u8 = 0;
//     const STATUS_VOTING: u8 = 1;
//     const STATUS_APPROVED: u8 = 2;
//     const STATUS_REJECTED: u8 = 3;

//     /// Function to create and store a DAO
//     public entry fun create_dao(owner: &signer, name: vector<u8>, logo: vector<u8>, council: vector<address>) {
//         let owner_addr = signer::address_of(owner);
//         // Prevent overwriting existing DAO
//         assert!(!exists<DAO>(owner_addr), E_DAO_ALREADY_EXISTS);
        
//         let dao = DAO {
//             owner: owner_addr,
//             name,
//             logo,
//             council,
//             proposals: vector::empty(),
//             proposal_created_events: account::new_event_handle<ProposalCreated>(owner),
//             voting_started_events: account::new_event_handle<VotingStarted>(owner),
//             vote_cast_events: account::new_event_handle<VoteCast>(owner),
//             proposal_finalized_events: account::new_event_handle<ProposalFinalized>(owner),
//         };
//         move_to(owner, dao);
//     }

//     /// Function to create a proposal (only the DAO owner can do this)
//     public entry fun create_proposal(creator: &signer, description: vector<u8>) acquires DAO {
//         let creator_address = signer::address_of(creator);
        
//         // Check if DAO exists at creator's address
//         assert!(exists<DAO>(creator_address), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global_mut<DAO>(creator_address);
        
//         // Check if the creator is the owner of the DAO
//         assert!(creator_address == dao.owner, E_NOT_OWNER);
        
//         let proposal_id = vector::length(&dao.proposals);
//         let proposal = Proposal {
//             id: proposal_id,
//             description,
//             status: STATUS_PENDING,
//             yes_voters: vector::empty<address>(),
//             no_voters: vector::empty<address>(),
//         };
//         vector::push_back(&mut dao.proposals, proposal);
//         event::emit_event(&mut dao.proposal_created_events, ProposalCreated {
//             dao_owner: creator_address,
//             proposal_id,
//             description,
//         });
//     }

//     /// Function to start voting on a proposal (only the DAO owner can do this)
//     public entry fun start_voting(admin: &signer, proposal_id: u64) acquires DAO {
//         let admin_addr = signer::address_of(admin);
        
//         // Check if DAO exists
//         assert!(exists<DAO>(admin_addr), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global_mut<DAO>(admin_addr);
//         assert!(admin_addr == dao.owner, E_NOT_OWNER);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow_mut(&mut dao.proposals, proposal_id);
//         assert!(proposal.status == STATUS_PENDING, E_INVALID_STATUS);
//         proposal.status = STATUS_VOTING;
//         event::emit_event(&mut dao.voting_started_events, VotingStarted {
//             dao_owner: admin_addr,
//             proposal_id,
//         });
//     }

//     /// Function to cast a vote on a proposal (only council members can do this)
//     public entry fun cast_vote(voter: &signer, dao_owner: address, proposal_id: u64, yes: bool) acquires DAO {
//         // Check if DAO exists
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global_mut<DAO>(dao_owner);
//         let voter_address = signer::address_of(voter);
//         assert!(vector::contains(&dao.council, &voter_address), E_NOT_COUNCIL_MEMBER);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow_mut(&mut dao.proposals, proposal_id);
//         assert!(proposal.status == STATUS_VOTING, E_INVALID_STATUS);
//         assert!(!vector::contains(&proposal.yes_voters, &voter_address) &&
//                 !vector::contains(&proposal.no_voters, &voter_address), E_ALREADY_VOTED);
//         if (yes) {
//             vector::push_back(&mut proposal.yes_voters, voter_address);
//         } else {
//             vector::push_back(&mut proposal.no_voters, voter_address);
//         };
//         event::emit_event(&mut dao.vote_cast_events, VoteCast {
//             dao_owner,
//             proposal_id,
//             voter: voter_address,
//             yes,
//         });
//     }

//     /// Function to finalize voting on a proposal (only the DAO owner can do this)
//     public entry fun finalize_voting(admin: &signer, proposal_id: u64) acquires DAO {
//         let admin_addr = signer::address_of(admin);
        
//         // Check if DAO exists
//         assert!(exists<DAO>(admin_addr), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global_mut<DAO>(admin_addr);
//         assert!(admin_addr == dao.owner, E_NOT_OWNER);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow_mut(&mut dao.proposals, proposal_id);
//         assert!(proposal.status == STATUS_VOTING, E_INVALID_STATUS);
//         let yes_count = vector::length(&proposal.yes_voters);
//         let no_count = vector::length(&proposal.no_voters);
//         if (yes_count > no_count) {
//             proposal.status = STATUS_APPROVED;
//         } else {
//             proposal.status = STATUS_REJECTED;
//         };
//         event::emit_event(&mut dao.proposal_finalized_events, ProposalFinalized {
//             dao_owner: admin_addr,
//             proposal_id,
//             status: proposal.status,
//         });
//     }

//     /// Helper function to check if an address is a council member
//     public fun is_council_member(dao_owner: address, member: address): bool acquires DAO {
//         if (!exists<DAO>(dao_owner)) {
//             return false
//         };
        
//         let dao = borrow_global<DAO>(dao_owner);
//         vector::contains(&dao.council, &member)
//     }
    
//     /// Function to get proposal description
//     #[view]
//     public fun get_proposal_description(dao_owner: address, proposal_id: u64): vector<u8> acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow(&dao.proposals, proposal_id);
//         proposal.description
//     }
    
//     /// Function to get proposal ID
//     #[view]
//     public fun get_proposal_id(dao_owner: address, proposal_id: u64): u64 acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow(&dao.proposals, proposal_id);
//         proposal.id
//     }

//     #[view]
//     /// Function to get DAO details
//     public fun get_dao_info(dao_owner: address): (address, vector<u8>, vector<u8>, vector<address>, u64) acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         (
//             dao.owner,
//             dao.name,
//             dao.logo,
//             dao.council,
//             vector::length(&dao.proposals)
//         )
//     }

//     #[view]
//     /// Function to get proposal details
//     public fun get_proposal(dao_owner: address, proposal_id: u64): Proposal acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         *vector::borrow(&dao.proposals, proposal_id)
//     }

//     #[view]
//     /// Function to get proposal status
//     public fun get_proposal_status(dao_owner: address, proposal_id: u64): u8 acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow(&dao.proposals, proposal_id);
//         proposal.status
//     }

//     #[view]
//     /// Function to get vote counts for a proposal
//     public fun get_vote_counts(dao_owner: address, proposal_id: u64): (u64, u64) acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow(&dao.proposals, proposal_id);
//         let yes_count = vector::length(&proposal.yes_voters);
//         let no_count = vector::length(&proposal.no_voters);
//         (yes_count, no_count)
//     }

//     #[view]
//     /// Function to check if address has voted
//     public fun has_voted(dao_owner: address, proposal_id: u64, voter: address): (bool, bool) acquires DAO {
//         assert!(exists<DAO>(dao_owner), E_DAO_NOT_FOUND);
        
//         let dao = borrow_global<DAO>(dao_owner);
//         assert!(proposal_id < vector::length(&dao.proposals), E_INVALID_PROPOSAL);
//         let proposal = vector::borrow(&dao.proposals, proposal_id);
//         let voted_yes = vector::contains(&proposal.yes_voters, &voter);
//         let voted_no = vector::contains(&proposal.no_voters, &voter);
//         (voted_yes, voted_no)
//     }
    
//     /// Function to compare two byte vectors
//     public fun compare_bytes(a: vector<u8>, b: vector<u8>): bool {
//         if (vector::length(&a) != vector::length(&b)) {
//             return false
//         };
        
//         let i = 0;
//         let len = vector::length(&a);
        
//         while (i < len) {
//             if (*vector::borrow(&a, i) != *vector::borrow(&b, i)) {
//                 return false
//             };
//             i = i + 1;
//         };
        
//         true
//     }
// }

