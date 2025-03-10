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
    }

    mapping(uint256 => TicketsOnSale) public resaleTickets;

    event TicketListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event TicketPurchased(uint256 indexed tokenId, uint256 price, address indexed buyer);

    function listTicket(string memory metadataURI, uint256 price) public {
        require(price > 0, "TicketResell: price must be greater than 0");

        ticketId++;
        uint256 tokenId = ticketId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        resaleTickets[tokenId] = TicketsOnSale({
            onSale: true,
            price: price,
            seller: msg.sender
        });

        emit TicketListed(tokenId, price, msg.sender);
    }

    function resellTicket(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "TicketResell: Not the owner");
        require(price > 0, "TicketResell: price must be greater than 0");

        resaleTickets[tokenId] = TicketsOnSale({
            onSale: true,
            price: price,
            seller: msg.sender
        });

        emit TicketListed(tokenId, price, msg.sender);
    }

    function buyTicket(uint256 tokenId) public payable {
        TicketsOnSale storage ticket = resaleTickets[tokenId];

        require(ticket.onSale, "TicketResell: ticket is not on sale");
        require(msg.value == ticket.price, "TicketResell: incorrect price");

        address seller = ticket.seller;

        require(seller != msg.sender, "TicketResell: Cannot buy your own ticket");

        require(getApproved(tokenId) == address(this) || isApprovedForAll(seller, address(this)), 
                "TicketResell: Contract is not approved to transfer this ticket");

        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        // delete resaleTickets[tokenId];

        emit TicketPurchased(tokenId, msg.value, msg.sender);
    }

    function isListed(uint256 tokenId) public view returns (bool) {
        return resaleTickets[tokenId].onSale;
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return resaleTickets[tokenId].price;
    }

    function getAllTickets() public view returns (uint256[] memory) {
        uint256[] memory tickets = new uint256[](ticketId);

        for (uint256 i = 1; i <= ticketId; i++) {
            tickets[i - 1] = i;
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
