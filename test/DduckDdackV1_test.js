/* eslint-disable no-undef */
const { expect, assert } = require("chai");

const DduckDdackV1 = artifacts.require("DduckDdackV1.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DduckDdackV1", (accounts) => {
  let nft;
  const [owner, user1, user2] = accounts;

  beforeEach(async () => {
    nft = await DduckDdackV1.new();
  });

  describe("deployed", () => {
    it("deployed propery", async () => {
      const name = await nft.name();
      const symbol = await nft.symbol();

      assert.equal(name, "DduckDdack");
      assert.equal(symbol, "DKD");
    });

    it("deployed with right owner", async () => {
      const deployedOwner = await nft.owner();

      assert.equal(deployedOwner, owner);
    });
  });
  describe("Mint", () => {
    beforeEach(async () => {
      await nft.setMintingContract(owner);
      await nft.safeMint(user1, 123456, "https://www.naver.com");
    });
    it("should mint with wallpeperKey 123456", async () => {
      const result = await nft.checkWallPapperKey(123456);

      assert.equal(result, true);
    });

    it("should increase the total supply", async () => {
      const total = await nft.totalSupply();

      assert.equal(total, 1);
    });

    it("should next mint tokenID +1", async () => {
      await nft.safeMint(user1, 1234562, "example");
      const ownerOfTokenId2 = await nft.ownerOf(2);
      assert.equal(ownerOfTokenId2, user1);
    });

    it("only owner can mint", async () => {
      return await expect(
        nft.safeMint(user2, 1234567, "example", { from: user1 })
      ).to.be.rejectedWith("Message sender is not Minting contract");
    });

    it("only unique wallpaperKey could be minted", async () => {
      return await expect(
        nft.safeMint(user2, 123456, "example")
      ).to.be.rejectedWith("This Wallpapper already taken");
    });

    it("should return correct TokenRUI", async () => {
      const uri = await nft.tokenURI(1);
      assert.equal(uri, "https://www.naver.com");
    });
  });
});
