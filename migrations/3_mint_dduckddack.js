const MyNFT = artifacts.require("MyNFT");
const Minting = artifacts.require("MintDduckDdack");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(Minting, MyNFT.address).then(() => {
    if (Minting._json) {
      fs.writeFile(
        "deployedABI_Minting",
        JSON.stringify(Minting._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_Minting", Minting.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
