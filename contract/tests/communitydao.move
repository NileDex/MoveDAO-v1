// #[test_only]
// module my_addrx::dao_tests {
//     use std::signer;
//     use std::vector;
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
//     #[expected_failure(abort_code = 0, location = my_addrx::Dao)]
//     fun test_non_owner_create_proposal() {
//         let (dao_owner, _, _, non_member) = setup_test_accounts();
        
//         // Create a council list
//         let council = vector::empty<address>();
//         vector::push_back(&mut council, COUNCIL_MEMBER1);
//         vector::push_back(&mut council, COUNCIL_MEMBER2);
        
//         // Create the DAO
//         Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, council);
        
//         // Create a DAO for the non_member so we can test ownership check
//         let non_member_council = vector::empty<address>();
//         Dao::create_dao(&non_member, b"NonMemberDAO", b"logo", non_member_council);
        
//         // Non-owner tries to create a proposal for the original DAO owner (should fail with E_NOT_OWNER)
//         // We first need to create a proposal at non_member's own address to ensure the DAO resource exists
//         Dao::create_proposal(&non_member, b"My Proposal");
        
//         // Now try to create proposal for the original DAO owner's content (this should fail)
//         Dao::create_proposal(&non_member, PROPOSAL_DESCRIPTION);
//     }
    
//     // Test: Expected failure - Non-member trying to vote
//     #[test]
//     #[expected_failure(abort_code = 4, location = my_addrx::Dao)]
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
    const COUNCIL_MEMBER3: address = @0xABCD;
    const COUNCIL_MEMBER4: address = @0x1234;
    const COUNCIL_MEMBER5: address = @0x5678;
    const COUNCIL_MEMBER6: address = @0x9ABC;
    const COUNCIL_MEMBER7: address = @0xDEF0;
    const COUNCIL_MEMBER8: address = @0xF123; // Extra member to test limit
    const NON_MEMBER: address = @0xFACE;

    // Test data
    const DAO_NAME: vector<u8> = b"TestDAO";
    const DAO_LOGO: vector<u8> = b"logo_url";
    const DAO_BACKDROP: vector<u8> = b"backdrop_url";
    const PROPOSAL_DESCRIPTION: vector<u8> = b"Test Proposal";

    // Error codes for tests
    const ASSERT_FAILED: u64 = 1;
    const PROPOSAL_ID_MISMATCH: u64 = 2;
    const DESCRIPTION_MISMATCH: u64 = 3;
    const STATUS_MISMATCH: u64 = 4;
    const COUNCIL_MEMBER_CHECK_FAILED: u64 = 5;
    const VOTE_COUNT_MISMATCH: u64 = 6;
    const BACKDROP_MISMATCH: u64 = 7;
    const LOGO_MISMATCH: u64 = 8;

    // Helper function to set up test accounts
    fun setup_test_accounts(): (signer, signer, signer, signer) {
        let dao_owner = account::create_account_for_test(DAO_OWNER);
        let council_member1 = account::create_account_for_test(COUNCIL_MEMBER1);
        let council_member2 = account::create_account_for_test(COUNCIL_MEMBER2);
        let non_member = account::create_account_for_test(NON_MEMBER);
        
        (dao_owner, council_member1, council_member2, non_member)
    }

    // Helper function to set up all council member accounts
    fun setup_all_council_members(): (signer, signer, signer, signer, signer, signer, signer, signer) {
        let member1 = account::create_account_for_test(COUNCIL_MEMBER1);
        let member2 = account::create_account_for_test(COUNCIL_MEMBER2);
        let member3 = account::create_account_for_test(COUNCIL_MEMBER3);
        let member4 = account::create_account_for_test(COUNCIL_MEMBER4);
        let member5 = account::create_account_for_test(COUNCIL_MEMBER5);
        let member6 = account::create_account_for_test(COUNCIL_MEMBER6);
        let member7 = account::create_account_for_test(COUNCIL_MEMBER7);
        let member8 = account::create_account_for_test(COUNCIL_MEMBER8);
        
        (member1, member2, member3, member4, member5, member6, member7, member8)
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Verify DAO creation
        let (owner, name, logo, backdrop, council_list, proposal_count) = Dao::get_dao_info(DAO_OWNER);
        
        assert!(owner == DAO_OWNER, ASSERT_FAILED);
        assert!(Dao::compare_bytes(name, DAO_NAME), ASSERT_FAILED);
        assert!(Dao::compare_bytes(logo, DAO_LOGO), LOGO_MISMATCH);
        assert!(Dao::compare_bytes(backdrop, DAO_BACKDROP), BACKDROP_MISMATCH);
        assert!(vector::length(&council_list) == 2, ASSERT_FAILED);
        assert!(proposal_count == 0, ASSERT_FAILED);
    }
    
    // Test: Create a DAO with maximum allowed council members (7)
    #[test]
    fun test_create_dao_with_max_members() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        let (_, _, _, _, _, _, _, _) = setup_all_council_members();
        
        // Create a council list with the maximum of 7 members
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        vector::push_back(&mut council, COUNCIL_MEMBER3);
        vector::push_back(&mut council, COUNCIL_MEMBER4);
        vector::push_back(&mut council, COUNCIL_MEMBER5);
        vector::push_back(&mut council, COUNCIL_MEMBER6);
        vector::push_back(&mut council, COUNCIL_MEMBER7);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Verify DAO creation with 7 council members
        let (owner, name, logo, backdrop, council_list, proposal_count) = Dao::get_dao_info(DAO_OWNER);
        
        assert!(owner == DAO_OWNER, ASSERT_FAILED);
        assert!(Dao::compare_bytes(name, DAO_NAME), ASSERT_FAILED);
        assert!(Dao::compare_bytes(logo, DAO_LOGO), LOGO_MISMATCH);
        assert!(Dao::compare_bytes(backdrop, DAO_BACKDROP), BACKDROP_MISMATCH);
        assert!(vector::length(&council_list) == 7, ASSERT_FAILED);
        assert!(proposal_count == 0, ASSERT_FAILED);
    }
    
    // Test: Expected failure - Create DAO with too many council members (8)
    #[test]
    #[expected_failure(abort_code = Dao::E_TOO_MANY_COUNCIL_MEMBERS, location = my_addrx::Dao)]
    fun test_create_dao_with_too_many_members() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        let (_, _, _, _, _, _, _, _) = setup_all_council_members();
        
        // Create a council list with 8 members (exceeding the maximum of 7)
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        vector::push_back(&mut council, COUNCIL_MEMBER3);
        vector::push_back(&mut council, COUNCIL_MEMBER4);
        vector::push_back(&mut council, COUNCIL_MEMBER5);
        vector::push_back(&mut council, COUNCIL_MEMBER6);
        vector::push_back(&mut council, COUNCIL_MEMBER7);
        vector::push_back(&mut council, COUNCIL_MEMBER8); // This exceeds the limit
        
        // Create the DAO - should fail with E_TOO_MANY_COUNCIL_MEMBERS
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
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
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Check if addresses are council members
        assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER1), COUNCIL_MEMBER_CHECK_FAILED);
        assert!(Dao::is_council_member(DAO_OWNER, COUNCIL_MEMBER2), COUNCIL_MEMBER_CHECK_FAILED);
        assert!(!Dao::is_council_member(DAO_OWNER, NON_MEMBER), COUNCIL_MEMBER_CHECK_FAILED);
    }
    
    // Test: Expected failure - Non-owner trying to create a proposal
    #[test]
    #[expected_failure(abort_code = Dao::E_NOT_OWNER, location = my_addrx::Dao)]
    fun test_non_owner_create_proposal() {
        let (dao_owner, _, _, non_member) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Non-owner tries to create a proposal (should fail with E_NOT_OWNER)
        Dao::create_proposal(&non_member, PROPOSAL_DESCRIPTION);
    }
    
    // Test: Expected failure - Non-member trying to vote
    #[test]
    #[expected_failure(abort_code = Dao::E_NOT_COUNCIL_MEMBER, location = my_addrx::Dao)]
    fun test_non_member_vote() {
        let (dao_owner, _, _, non_member) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Non-member tries to vote (should fail)
        Dao::cast_vote(&non_member, DAO_OWNER, 0, true);
    }
    
    // Test: Test retrieving backdrop and logo directly
    #[test]
    fun test_get_logo_and_backdrop() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO with logo and backdrop
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Retrieve and verify logo
        let logo = Dao::get_logo(DAO_OWNER);
        assert!(Dao::compare_bytes(logo, DAO_LOGO), LOGO_MISMATCH);
        
        // Retrieve and verify backdrop
        let backdrop = Dao::get_backdrop(DAO_OWNER);
        assert!(Dao::compare_bytes(backdrop, DAO_BACKDROP), BACKDROP_MISMATCH);
    }
    
    // Test: Create DAO with different backdrop and logo
    #[test]
    fun test_create_dao_with_different_images() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create DAO with different backdrop and logo values
        let custom_logo = b"custom_logo_data";
        let custom_backdrop = b"custom_backdrop_image";
        
        Dao::create_dao(&dao_owner, DAO_NAME, custom_logo, custom_backdrop, council);
        
        // Verify DAO was created with correct images
        let (_, _, logo, backdrop, _, _) = Dao::get_dao_info(DAO_OWNER);
        
        assert!(Dao::compare_bytes(logo, custom_logo), LOGO_MISMATCH);
        assert!(Dao::compare_bytes(backdrop, custom_backdrop), BACKDROP_MISMATCH);
        
        // Double-check with direct getters
        let retrieved_logo = Dao::get_logo(DAO_OWNER);
        let retrieved_backdrop = Dao::get_backdrop(DAO_OWNER);
        
        assert!(Dao::compare_bytes(retrieved_logo, custom_logo), LOGO_MISMATCH);
        assert!(Dao::compare_bytes(retrieved_backdrop, custom_backdrop), BACKDROP_MISMATCH);
    }

    // Test: Expected failure - Double voting
    #[test]
    #[expected_failure(abort_code = Dao::E_ALREADY_VOTED, location = my_addrx::Dao)]
    fun test_double_voting() {
        let (dao_owner, council_member1, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Create a proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Start voting
        Dao::start_voting(&dao_owner, 0);
        
        // Cast vote
        Dao::cast_vote(&council_member1, DAO_OWNER, 0, true); // Yes vote
        
        // Try to vote again (should fail with E_ALREADY_VOTED)
        Dao::cast_vote(&council_member1, DAO_OWNER, 0, false);
    }

    // Test: Expected failure - Voting on non-existent proposal
    #[test]
    #[expected_failure(abort_code = Dao::E_PROPOSAL_NOT_FOUND, location = my_addrx::Dao)]
    fun test_vote_non_existent_proposal() {
        let (dao_owner, council_member1, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Try to vote on a non-existent proposal (ID 99)
        Dao::cast_vote(&council_member1, DAO_OWNER, 99, true);
    }

    // Test: Expected failure - Finalizing a non-voting proposal
    #[test]
    #[expected_failure(abort_code = Dao::E_INVALID_STATUS, location = my_addrx::Dao)]
    fun test_finalize_non_voting_proposal() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Create a proposal (but don't start voting)
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Try to finalize voting (should fail because proposal is still PENDING)
        Dao::finalize_voting(&dao_owner, 0);
    }

    // Test: Multiple proposals in one DAO
    #[test]
    fun test_multiple_proposals() {
        let (dao_owner, _, _, _) = setup_test_accounts();
        
        // Create a council list
        let council = vector::empty<address>();
        vector::push_back(&mut council, COUNCIL_MEMBER1);
        vector::push_back(&mut council, COUNCIL_MEMBER2);
        
        // Create the DAO
        Dao::create_dao(&dao_owner, DAO_NAME, DAO_LOGO, DAO_BACKDROP, council);
        
        // Create first proposal
        Dao::create_proposal(&dao_owner, PROPOSAL_DESCRIPTION);
        
        // Create second proposal with different description
        let second_description = b"Second Proposal";
        Dao::create_proposal(&dao_owner, second_description);
        
        // Verify proposal count
        let (_, _, _, _, _, proposal_count) = Dao::get_dao_info(DAO_OWNER);
        assert!(proposal_count == 2, ASSERT_FAILED);
        
        // Verify both proposals exist with correct descriptions
        let description1 = Dao::get_proposal_description(DAO_OWNER, 0);
        let description2 = Dao::get_proposal_description(DAO_OWNER, 1);
        
        assert!(Dao::compare_bytes(description1, PROPOSAL_DESCRIPTION), DESCRIPTION_MISMATCH);
        assert!(Dao::compare_bytes(description2, second_description), DESCRIPTION_MISMATCH);
    }
}