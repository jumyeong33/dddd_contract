const MyNFT = artifacts.require("MyNFT");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(MyNFT).then(() => {
    if (MyNFT._json) {
      fs.writeFile(
        "deployedABI_DduckDdack",
        JSON.stringify(MyNFT._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_DduckDdack", MyNFT.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
