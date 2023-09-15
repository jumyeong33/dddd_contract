// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyNFT.sol";

contract MintDduckDdack is Ownable {
  uint256 public maxSupply = 500;

  MyNFT public DduckDdack;
  mapping(address => bool) addressCheck;
  event Mint(address to, uint256 tokenId);

  constructor(address _dduckDdackNFT) {
    DduckDdack = MyNFT(_dduckDdackNFT);
  }

  function freeMint(
    address _to,
    uint256 _wallPaperKey,
    string memory _tokenURI
  ) public onlyOwner {
    uint256 supply = DduckDdack.totalSupply();
    require(supply < maxSupply, "Cannot Mint over max supply");
    uint256 tokenId = DduckDdack.safeMint(_to, _wallPaperKey, _tokenURI);

    addressCheck[_to] = true;
    emit Mint(_to, tokenId);
  }

  function checkAddress(address _from) public view returns (bool) {
    return addressCheck[_from];
  }
}
