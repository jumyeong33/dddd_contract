// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721Enumerable, ERC721URIStorage, Ownable {
  address public mintingContract;
  bool public paused = false;
  mapping(uint256 => bool) public wallPapperKeys;

  constructor() ERC721("MyNFT", "MNT") {}

  function setMintingContract(address _mintingContract) external onlyOwner {
    mintingContract = _mintingContract;
  }

  /**
  Only minting contract can mint DduckDdack 
   */
  function safeMint(
    address _to,
    uint256 _wallPapperKey,
    string memory _tokenURI
  ) external onlyMintingContract returns (uint256 _tokenId) {
    require(!paused);
    registerWallPapperKey(_wallPapperKey);

    _tokenId = totalSupply() + 1;
    _safeMint(_to, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);

    return _tokenId;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  modifier onlyMintingContract() {
    require(
      mintingContract == msg.sender,
      "Message sender is not Minting contract"
    );
    _;
  }

  function registerWallPapperKey(uint256 _wallPapperKey) internal {
    require(
      wallPapperKeys[_wallPapperKey] == false,
      "This Wallpapper already taken"
    );
    wallPapperKeys[_wallPapperKey] = true;
  }

  function checkWallPapperKey(uint256 _wallPapperKey)
    public
    view
    returns (bool)
  {
    return wallPapperKeys[_wallPapperKey];
  }

  /**
  override function 
   */

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
    super._burn(tokenId);
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
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
