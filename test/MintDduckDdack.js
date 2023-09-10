/* eslint-disable no-undef */
const { expect, assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
var Web3 = require("web3");
const web3 = new Web3("http://localhost:7545");

const DduckDdackV1 = artifacts.require("DduckDdackV1.sol");
const MintDduckDdack = artifacts.require("MintDduckDdack.sol");

function toWei(num) {
  return web3.utils.toWei(num, "ether");
}

function toNum(bn) {
  return Number(web3.utils.fromWei(bn, "ether"));
}

async function getBal(address) {
  return await web3.eth.getBalance(address);
}
/* 
    uint256 public costTier1 = 100 ether;
    uint256 public costTier2 = 200 ether;
    uint256 public costTier3 = 300 ether;

    uint256 public maxSupply = 20;
    uint256 public maxMintAmount = 5;
*/
contract("MintDduckDdack", (accounts) => {
  let nft;
  let minting;
  const [owner, user1, user2, user3, user4, user5] = accounts;

  beforeEach(async () => {
    nft = await DduckDdackV1.new();
    minting = await MintDduckDdack.new(nft.address);

    await nft.setMintingContract(minting.address);
  });

  describe("deployed", () => {
    it("should set minting contract address as deployed contract address", async () => {
      assert.equal(await nft.mintingContract(), minting.address);
    });
  });

  describe("Mint", () => {
    describe("Free minting NFT", async () => {
      beforeEach(async () => {
        await minting.freeMint(user1, 123456, "example", { from: user1 });
      });

      it("should create a nft", async () => {
        assert.equal(await nft.totalSupply(), 1);
      });

      it("should transfer nft to correct owner", async () => {
        assert.equal(await nft.ownerOf(1), user1);
      });
    });
    //n times minting. test below testing is 2
    describe("Minting priced NFTs", () => {
      beforeEach(async () => {
        const price = await toWei("1");

        await minting.freeMint(user1, 123456, "example", { from: user1 });
        await minting.freeMint(user2, 123457, "example", { from: user2 });
        await minting.freeMint(user3, 123458, "example", { from: user3 });
        await minting.freeMint(user4, 123459, "example", { from: user4 });
        await minting.pricedMint(user5, 123451, "example", {
          from: user5,
          value: price,
        });
      });
      it("should mint nft paid by native token", async () => {
        assert.equal(await nft.totalSupply(), 5);
      });

      it("should transfer nfts to correct owner", async () => {
        assert.equal(await nft.ownerOf(5), user5);
      });
      it("should transfer native token to correct contract", async () => {
        const bal = await getBal(minting.address);
        assert.equal(toNum(bal), 1);
      });
      it("should reject free minting funciton", async () => {
        return await expect(
          minting.freeMint(owner, 124532, "example")
        ).to.be.rejectedWith("Pre-Sale only possilbe untill 400 nfts");
      });
    });
    //for testing, next cost minting number is 11
    //     describe("Happy Pass minting with next cost", () => {
    //       beforeEach(async () => {
    //         await minting.mint(user1, 5, { from: user1 });
    //         const bal = await ctToken.balanceOf(minting.address);

    //         assert.equal(toNum(bal), 500);
    //       });
    //       it("should mint with next cost", async () => {
    //         await minting.mint(user2, 1, { from: user2 });
    //         const bal = await ctToken.balanceOf(user2);

    //         assert.equal(toNum(bal), 800);
    //       });
    //     });
    //     //for testing, maxSupply = 19
    //     describe("Require Pass", () => {
    //       describe("_mintAmount", () => {
    //         it("should be more than 0", async () => {
    //           return await expect(
    //             minting.mint(user1, 0, { from: user1 })
    //           ).to.be.rejectedWith("Cannot mint 0 tokens");
    //         });

    //         it("should be less than 5", async () => {
    //           return await expect(
    //             minting.mint(user1, 6, { from: user1 })
    //           ).to.be.rejectedWith("Cannot exceed the maximun mint amount");
    //         });

    //         it("should be less than max supply amount", async () => {
    //           await minting.mint(user2, 5, { from: user2 });
    //           await minting.mint(user3, 5, { from: user3 });

    //           return await expect(
    //             minting.mint(user1, 5, { from: user1 })
    //           ).to.be.rejectedWith("Cannot exceed the maximum token supply");
    //         });

    //         it("should be less than max amount per person", async () => {
    //           await minting.mint(user1, 3, { from: user1 });

    //           return await expect(
    //             minting.mint(user1, 3, { from: user1 })
    //           ).to.be.rejectedWith("Cannot exceed the maximum per-person limit");
    //         });
    //       });
    //       describe("ct token balance", () => {
    //         describe("previous cost", () => {
    //           it("buyer should have enough token to mint", async () => {
    //             return await expect(
    //               minting.mint(user4, 3, { from: user4 })
    //             ).to.be.rejectedWith("ERC20: transfer amount exceeds balance");
    //           });
    //         });

    //         describe("next cost", () => {
    //           it("buyer should have enough token to mint", async () => {
    //             await minting.mint(user2, 5, { from: user2 });
    //             return await expect(
    //               minting.mint(user4, 2, { from: user4 })
    //             ).to.be.rejectedWith("ERC20: transfer amount exceeds balance");
    //           });
    //         });
    //       });
    //     });
    //   });

    describe("withdraw", () => {
      describe("Happy Pass", () => {
        beforeEach(async () => {
          const price = await toWei("1");

          await minting.freeMint(user1, 123456, "example", { from: user1 });
          await minting.freeMint(user2, 123457, "example", { from: user2 });
          await minting.freeMint(user3, 123458, "example", { from: user3 });
          await minting.freeMint(user4, 123459, "example", { from: user4 });
          await minting.pricedMint(user5, 123451, "example", {
            from: user5,
            value: price,
          });
          await minting.pricedMint(owner, 123452, "example", {
            value: price,
          });
        });
        it("should withdraw to owner", async () => {
          const ownerBalBefore = toNum(await getBal(owner));
          const contractBalBefore = toNum(await getBal(minting.address));
          await minting.withdraw();
          const contractBalAfter = toNum(await getBal(minting.address));
          const ownerBalAfter = toNum(await getBal(owner));

          assert.equal(contractBalBefore, 2);
          assert.equal(contractBalAfter, 0);
          assert.approximately(ownerBalAfter - ownerBalBefore, 2, 0.1);
        });
      });
    });
    //     describe("reject withdraw", () => {
    //       it("caller is not owner", async () => {
    //         return await expect(
    //           minting.withdraw({ from: user1 })
    //         ).to.be.rejectedWith("Ownable: caller is not the owner");
    //       });
    //     });
  });
});
