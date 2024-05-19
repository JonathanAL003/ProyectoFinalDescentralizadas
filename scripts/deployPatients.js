async function main(){
    const Patients = await ethers.getContractFactory('Patients');
    const patients = await Patients.deploy()
    const txHash = patients.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to Address:", txReceipt.contractAddress);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
