// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketResell is ERC721, ERC721URIStorage {
    uint256 public ticketId;

    constructor() ERC721("TicketResell", "TIC") {}

    struct TicketsOnSale {
        bool onSale;
        uint256 price;
        address seller;
        string metadata;
    }

    mapping(uint256 => TicketsOnSale) public resaleTickets;

    event TicketListed(uint256 indexed tokenId, uint256 price, address indexed seller, string metadata);
    event TicketPurchased(uint256 indexed tokenId, uint256 price, address indexed buyer);

    function listTicket(string memory metadataURI, uint256 price, string memory metadata) public {
        require(price > 0, "TicketResell: price must be greater than 0");

        ticketId++;
        uint256 tokenId = ticketId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        resaleTickets[tokenId] = TicketsOnSale({
            onSale: true,
            price: price,
            seller: msg.sender,
            metadata: metadata
        });

        emit TicketListed(tokenId, price, msg.sender, metadata);
    }

    function buyTicket(uint256 tokenId) public payable {
        TicketsOnSale storage ticket = resaleTickets[tokenId];

        require(ticket.onSale, "TicketResell: Ticket is not on sale");
        require(msg.value == ticket.price, "TicketResell: Incorrect price");

        address seller = ticket.seller;
        require(seller != msg.sender, "TicketResell: Cannot buy your own ticket");

        require(isApprovedForAll(seller, address(this)), "TicketResell: Contract is not approved");

        // Transfer ticket ownership
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        // Update ticket sale status instead of deleting it
        ticket.onSale = false;

        emit TicketPurchased(tokenId, msg.value, msg.sender);
    }

    function isListed(uint256 tokenId) public view returns (bool) {
        return resaleTickets[tokenId].onSale;
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return resaleTickets[tokenId].price;
    }

    function getAllTickets() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= ticketId; i++) {
            if (_exists(i)) {
                count++;
            }
        }

        uint256[] memory tickets = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= ticketId; i++) {
            if (_exists(i)) {
                tickets[index] = i;
                index++;
            }
        }

        return tickets;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
