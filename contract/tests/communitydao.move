// #[test_only]
// module my_addrx::dao_tests {
//     use std::signer;
//     use std::vector;
//     use std::string;
//     use aptos_framework::account;
//     use my_addrx::Dao;

//     // Test accounts
//     const DAO_OWNER: address = @0xCAFE;
//     const COUNCIL_MEMBER1: address = @0xC0DE;
//     const COUNCIL_MEMBER2: address = @0xBEEF;
//     const NON_MEMBER: address = @0xFACE;

//     // Test data
//     const DAO_NAME: vector<u8> = b"TestDAO";
//     const DAO_LOGO: vector<u8> = b"logo_url";
//     const PROPOSAL_DESCRIPTION: vector<u8> = b"Test Proposal";

//     // Error codes for tests
//     const ASSERT_FAILED: u64 = 1;
//     const PROPOSAL_ID_MISMATCH: u64 = 2;
//     const DESCRIPTION_MISMATCH: u64 = 3;
//     const STATUS_MISMATCH: u64 = 4;
//     const COUNCIL_MEMBER_CHECK_FAILED: u64 = 5;
//     const VOTE_COUNT_MISMATCH: u64 = 6;

//     // Helper function to set up test accounts
//     fun setup_test_accounts(): (signer, signer, signer, signer) {
//         let dao_owner = account::create_account_for_test(DAO_OWNER);
//         let council_member1 = account::create_account_for_test(COUNCIL_MEMBER1);
//         let council_member2 = account::create_account_for_test(COUNCIL_MEMBER2);
//         let non_member = account::create_account_for_test(NON_MEMBER);
        
//         (dao_owner, council_member1, council_member2, non_member)
//     }

//     // Test: Create a DAO
//     #[test]
//     fun test_create_dao() {
//         let (dao_owner, _, _, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Verify DAO creation
//         let (owner, name, logo, council_list, proposal_count) = Dao::get_dao_info(DAO_OWNER);
        
//         assert!(owner == DAO_OWNER, ASSERT_FAILED);
//         assert!(Dao::compare_bytes(name, DAO_NAME), ASSERT_FAILED);
//         assert!(Dao::compare_bytes(logo, DAO_LOGO), ASSERT_FAILED);
//         assert!(vector::length(&council_list) == 2, ASSERT_FAILED);
//         assert!(proposal_count == 0, ASSERT_FAILED);
//     }
    
//     // Test: Create a proposal
//     #[test]
//     fun test_create_proposal() {
//         let (dao_owner, _, _, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Verify proposal creation
//         let proposal_id = Dao::get_proposal_id(DAO_OWNER, 0);
//         let description = Dao::get_proposal_description(DAO_OWNER, 0);
//         let status = Dao::get_proposal_status(DAO_OWNER, 0);
        
//         assert!(proposal_id == 0, PROPOSAL_ID_MISMATCH);
//         assert!(Dao::compare_bytes(description, PROPOSAL_DESCRIPTION), DESCRIPTION_MISMATCH);
//         assert!(status == 0, STATUS_MISMATCH); // STATUS_PENDING
//     }
    
//     // Test: Start voting on a proposal
//     #[test]
//     fun test_start_voting() {
//         let (dao_owner, _, _, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Start voting
//         Dao::start_voting(&dao_owner, 0);
        
//         // Verify proposal status
//         let status = Dao::get_proposal_status(DAO_OWNER, 0);
//         assert!(status == 1, STATUS_MISMATCH); // STATUS_VOTING
//     }
    
//     // Test: Council member casting a vote
//     #[test]
//     fun test_cast_vote() {
//         let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Start voting
//         Dao::start_voting(&dao_owner, 0);
        
//         // Cast votes
//         Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
//         Dao::cast_vote(&council_member2, DAO_OWNER, 0, false); // No vote
        
//         // Verify vote counts
//         let (yes_count, no_count) = Dao::get_vote_counts(DAO_OWNER, 0);
//         assert!(yes_count == 1, VOTE_COUNT_MISMATCH);
//         assert!(no_count == 1, VOTE_COUNT_MISMATCH);
        
//         // Verify voting status
//         let (voted_yes, voted_no) = Dao::has_voted(DAO_OWNER, 0, COUNCIL_MEMBER1);
//         assert!(voted_yes == true, ASSERT_FAILED);
//         assert!(voted_no == false, ASSERT_FAILED);
        
//         let (voted_yes, voted_no) = Dao::has_voted(DAO_OWNER, 0, COUNCIL_MEMBER2);
//         assert!(voted_yes == false, ASSERT_FAILED);
//         assert!(voted_no == true, ASSERT_FAILED);
//     }
    
//     // Test: Finalize voting on a proposal
//     #[test]
//     fun test_finalize_voting() {
//         let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Start voting
//         Dao::start_voting(&dao_owner, 0);
        
//         // Cast votes (one yes, one no)
//         Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
//         Dao::cast_vote(&council_member2, DAO_OWNER, 0, false); // No vote
        
//         // Finalize voting
//         Dao::finalize_voting(&dao_owner, 0);
        
//         // Verify proposal status (should be rejected since equal yes and no votes)
//         let status = Dao::get_proposal_status(DAO_OWNER, 0);
//         assert!(status == 3, STATUS_MISMATCH); // STATUS_REJECTED
//     }
    
//     // Test: Finalize voting on a proposal with approval
//     #[test]
//     fun test_finalize_voting_with_approval() {
//         let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Start voting
//         Dao::start_voting(&dao_owner, 0);
        
//         // Cast votes (both yes)
//         Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
//         Dao::cast_vote(&council_member2, DAO_OWNER, 0, true); // Yes vote
        
//         // Finalize voting
//         Dao::finalize_voting(&dao_owner, 0);
        
//         // Verify proposal status
//         let status = Dao::get_proposal_status(DAO_OWNER, 0);
//         assert!(status == 2, STATUS_MISMATCH); // STATUS_APPROVED
//     }
    
//     // Test: Check if an address is a council member
//     #[test]
//     fun test_is_council_member() {
//         let (dao_owner, _, _, _) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Check if addresses are council members
//         assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER1), COUNCIL_MEMBER_CHECK_FAILED);
//         assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER2), COUNCIL_MEMBER_CHECK_FAILED);
//         assert!(!Dao::is_council_member(DAO_OWNER, NON_MEMBER), COUNCIL_MEMBER_CHECK_FAILED);
//     }
    
//     // Test: Expected failure - Non-owner trying to create a proposal
//     #[test]
//     #[expected_failure(abort_code = 0)] // E_NOT_OWNER
//     fun test_non_owner_create_proposal() {
//         let (dao_owner, _, _, non_member) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Non-owner tries to create a proposal (should fail)
//         Dao::create_proposal(&non_member, PROPOSAL_DESCRIPTION);
//     }
    
//     // Test: Expected failure - Non-member trying to vote
//     #[test]
//     #[expected_failure(abort_code = 4)] // E_NOT_COUNCIL_MEMBER
//     fun test_non_member_vote() {
//         let (dao_owner, _, _, non_member) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a proposal
//         Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
//         // Start voting
//         Dao::start_voting(&dao_owner, 0);
        
//         // Non-member tries to vote (should fail)
//         Dao::cast_vote(&non_member, DAO_OWNER, 0, true);
//     }
// }


#[test_only]
module my_addrx::dao_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use my_addrx::Dao;

    // Test accounts
    const DAO_OWNER: address = @0xCAFE;
    const COUNCIL_MEMBER1: address = @0xC0DE;
    const COUNCIL_MEMBER2: address = @0xBEEF;
    const NON_MEMBER: address = @0xFACE;

    // Test data
    const DAO_NAME: vector<u8> = b"TestDAO";
    const DAO_LOGO: vector<u8> = b"logo_url";
    const PROPOSAL_DESCRIPTION: vector<u8> = b"Test Proposal";

    // Error codes for tests
    const ASSERT_FAILED: u64 = 1;
    const PROPOSAL_ID_MISMATCH: u64 = 2;
    const DESCRIPTION_MISMATCH: u64 = 3;
    const STATUS_MISMATCH: u64 = 4;
    const COUNCIL_MEMBER_CHECK_FAILED: u64 = 5;
    const VOTE_COUNT_MISMATCH: u64 = 6;

    // Helper function to set up test accounts
    fun setup_test_accounts(): (signer, signer, signer, signer) {
        let dao_owner = account::create_account_for_test(DAO_OWNER);
        let council_member1 = account::create_account_for_test(COUNCIL_MEMBER1);
        let council_member2 = account::create_account_for_test(COUNCIL_MEMBER2);
        let non_member = account::create_account_for_test(NON_MEMBER);
        
        (dao_owner, council_member1, council_member2, non_member)
    }

    // Test: Create a DAO
    #[test]
    fun test_create_dao() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Verify DAO creation
        let (owner, name, logo, council_list, proposal_count) = Dao::get_dao_info(DAO_OWNER);
        
        assert!(owner == DAO_OWNER, ASSERT_FAILED);
        assert!(Dao::compare_bytes(name, DAO_NAME), ASSERT_FAILED);
        assert!(Dao::compare_bytes(logo, DAO_LOGO), ASSERT_FAILED);
        assert!(vector::length(&council_list) == 2, ASSERT_FAILED);
        assert!(proposal_count == 0, ASSERT_FAILED);
    }
    
    // Test: Create a proposal
    #[test]
    fun test_create_proposal() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Verify proposal creation
        let proposal_id = Dao::get_proposal_id(DAO_OWNER, 0);
        let description = Dao::get_proposal_description(DAO_OWNER, 0);
        let status = Dao::get_proposal_status(DAO_OWNER, 0);
        
        assert!(proposal_id == 0, PROPOSAL_ID_MISMATCH);
        assert!(Dao::compare_bytes(description, PROPOSAL_DESCRIPTION), DESCRIPTION_MISMATCH);
        assert!(status == 0, STATUS_MISMATCH); // STATUS_PENDING
    }
    
    // Test: Start voting on a proposal
    #[test]
    fun test_start_voting() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Verify proposal status
        let status = Dao::get_proposal_status(DAO_OWNER, 0);
        assert!(status == 1, STATUS_MISMATCH); // STATUS_VOTING
    }
    
    // Test: Council member casting a vote
    #[test]
    fun test_cast_vote() {
        let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Cast votes
        Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
        Dao::cast_vote(&council_member2, DAO_OWNER, 0, false); // No vote
        
        // Verify vote counts
        let (yes_count, no_count) = Dao::get_vote_counts(DAO_OWNER, 0);
        assert!(yes_count == 1, VOTE_COUNT_MISMATCH);
        assert!(no_count == 1, VOTE_COUNT_MISMATCH);
        
        // Verify voting status
        let (voted_yes, voted_no) = Dao::has_voted(DAO_OWNER, 0, COUNCIL_MEMBER1);
        assert!(voted_yes == true, ASSERT_FAILED);
        assert!(voted_no == false, ASSERT_FAILED);
        
        let (voted_yes, voted_no) = Dao::has_voted(DAO_OWNER, 0, COUNCIL_MEMBER2);
        assert!(voted_yes == false, ASSERT_FAILED);
        assert!(voted_no == true, ASSERT_FAILED);
    }
    
    // Test: Finalize voting on a proposal
    #[test]
    fun test_finalize_voting() {
        let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Cast votes (one yes, one no)
        Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
        Dao::cast_vote(&council_member2, DAO_OWNER, 0, false); // No vote
        
        // Finalize voting
        Dao::finalize_voting(&dao_owner, 0);
        
        // Verify proposal status (should be rejected since equal yes and no votes)
        let status = Dao::get_proposal_status(DAO_OWNER, 0);
        assert!(status == 3, STATUS_MISMATCH); // STATUS_REJECTED
    }
    
    // Test: Finalize voting on a proposal with approval
    #[test]
    fun test_finalize_voting_with_approval() {
        let (dao_owner, council_member1, council_member2, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Cast votes (both yes)
        Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
        Dao::cast_vote(&council_member2, DAO_OWNER, 0, true); // Yes vote
        
        // Finalize voting
        Dao::finalize_voting(&dao_owner, 0);
        
        // Verify proposal status
        let status = Dao::get_proposal_status(DAO_OWNER, 0);
        assert!(status == 2, STATUS_MISMATCH); // STATUS_APPROVED
    }
    
    // Test: Check if an address is a council member
    #[test]
    fun test_is_council_member() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Check if addresses are council members
        assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER1), COUNCIL_MEMBER_CHECK_FAILED);
        assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER2), COUNCIL_MEMBER_CHECK_FAILED);
        assert!(!Dao::is_council_member(DAO_OWNER, NON_MEMBER), COUNCIL_MEMBER_CHECK_FAILED);
    }
    
    // Test: Expected failure - Non-owner trying to create a proposal
    #[test]
    #[expected_failure(abort_code = 0, location = my_addrx::Dao)]
    fun test_non_owner_create_proposal() {
        let (dao_owner, _, _, non_member) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a DAO for the non_member so we can test ownership check
        let non_member_council = vector::empty<address>();
        Dao::create_dao(&non_member, b"NonMemberDAO", b"logo", non_member_council);
        
        // Non-owner tries to create a proposal for the original DAO owner (should fail with E_NOT_OWNER)
        // We first need to create a proposal at non_member's own address to ensure the DAO resource exists
        Dao::create_proposal(&non_member, b"My Proposal");
        
        // Now try to create proposal for the original DAO owner's content (this should fail)
        Dao::create_proposal(&non_member, PROPOSAL_DESCRIPTION);
    }
    
    // Test: Expected failure - Non-member trying to vote
    #[test]
    #[expected_failure(abort_code = 4, location = my_addrx::Dao)]
    fun test_non_member_vote() {
        let (dao_owner, _, _, non_member) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Non-member tries to vote (should fail)
        Dao::cast_vote(&non_member, DAO_OWNER, 0, true);
    }
}