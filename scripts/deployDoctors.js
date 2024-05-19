async function main(){
    const Doctors = await ethers.getContractFactory('Doctors');
    const doctors = await Doctors.deploy()
    const txHash = doctors.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to Address:", txReceipt.contractAddress);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});