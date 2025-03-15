module my_addrx::Dao {
    use std::signer;
    use std::vector;

    /// Resource struct representing a DAO
    struct DAO has key {
        owner: address,
        name: vector<u8>,
        logo: vector<u8>,
        council: vector<address>,
        proposals: vector<Proposal>,
    }

    /// Struct representing a proposal
    struct Proposal has store {
        id: u64,
        description: vector<u8>,
    }

    /// Function to create and store a DAO
    public fun create_dao(owner: &signer, name: vector<u8>, logo: vector<u8>, council: vector<address>) {
        let dao = DAO {
            owner: signer::address_of(owner),
            name,
            logo,
            council,
            proposals: vector::empty(),
        };
        move_to<DAO>(owner, dao);
    }

    /// Function to create a proposal (only the DAO owner can do this)
    public fun create_proposal(creator: &signer, description: vector<u8>) acquires DAO {
        let creator_address = signer::address_of(creator);
        let dao = borrow_global_mut<DAO>(creator_address);

        assert!(creator_address == dao.owner, 0); // Ensure only the owner can create proposals

        let new_proposal = Proposal {
            id: vector::length(&dao.proposals),
            description,
        };
        vector::push_back(&mut dao.proposals, new_proposal);
    }

    /// Function to manage a proposal (only council members can do this)
    public fun manage_proposal(dao_owner: address, proposal_id: u64, manager: &signer) acquires DAO {
        let dao = borrow_global_mut<DAO>(dao_owner);
        let manager_address = signer::address_of(manager);

        let is_council = false;
        let council_len = vector::length(&dao.council);
        let i = 0;

        while (i < council_len) {
            if (vector::borrow(&dao.council, i) == &manager_address) {
                is_council = true;
                break;
            };
            i = i + 1;
        };

        assert!(is_council, 0); // Only council members can manage proposals

        // Proposal management logic here
    }
}
