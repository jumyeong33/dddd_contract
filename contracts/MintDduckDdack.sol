// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyNFT.sol";

contract MintDduckDdack is Ownable {
  uint256 public maxSupply = 50;
  uint256 public freeSupply = 10;
  uint256 public cost = 0.001 ether;

  MyNFT public DduckDdack;
  mapping(address => bool) addressCheck;
  event PreMint(address to, uint256 tokenId);
  event PricedMint(address to, uint256 tokenId);

  constructor(address _dduckDdackNFT) {
    DduckDdack = MyNFT(_dduckDdackNFT);
  }

  function freeMint(
    address _to,
    uint256 _wallPaperKey,
    string memory _tokenURI
  ) public checkAddress onlyOwner {
    uint256 supply = DduckDdack.totalSupply();
    require(supply < freeSupply, "Pre-Sale only possilbe untill 400 nfts");
    uint256 tokenId = DduckDdack.safeMint(_to, _wallPaperKey, _tokenURI);

    addressCheck[_to] = true;
    emit PreMint(_to, tokenId);
  }

  function pricedMint(
    address _to,
    uint256 _wallPaperKey,
    string memory _tokenURI
  ) public payable checkAddress {
    uint256 supply = DduckDdack.totalSupply();
    require(supply < maxSupply, "Cannot exceed the maximun mint amount");
    require(msg.value >= cost, "Insufficent value");
    // send matic to minting contract
    uint256 tokenId = DduckDdack.safeMint(_to, _wallPaperKey, _tokenURI);
    addressCheck[_to] = true;

    emit PricedMint(_to, tokenId);
  }

  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(DduckDdack.owner()).call{
      value: address(this).balance
    }("");
    require(os);
  }

  modifier checkAddress() {
    require(!addressCheck[msg.sender], "Available mint once in each wallet");
    _;
  }
}
