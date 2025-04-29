let web3;
let contract;
const contractAddress = "0x04f287F0494e3341DB23c58A12432E939f2c4Cf0 ";

const contractABI = [
    
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_policyId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_docHash",
                    "type": "string"
                }
            ],
            "name": "fileClaim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_vehicleNumber",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_validityInDays",
                    "type": "uint256"
                }
            ],
            "name": "registerPolicy",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_claimId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "approve",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "remark",
                    "type": "string"
                }
            ],
            "name": "reviewClaim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "claimCounter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "claims",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "policyId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "docHash",
                    "type": "string"
                },
                {
                    "internalType": "enum VehicleInsuranceSystem.ClaimStatus",
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "adminRemark",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyClaims",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyPolicies",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "policies",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "policyHolder",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "vehicleNumber",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "premiumPaid",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "policyStart",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "policyEnd",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "active",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "policyCounter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "userClaims",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "userPolicies",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    
];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
    contract = new web3.eth.Contract(contractABI, contractAddress);
    loadData();
  } else {
    alert("Install MetaMask!");
  }
}

async function registerPolicy() {
    const patientId = document.getElementById("patientId").value;
    const coverageDays = document.getElementById("coverageDays").value;
    const premium = web3.utils.toWei(document.getElementById("medicalPremium").value, "ether");
    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerPolicy(patientId, coverageDays).send({ from: accounts[0], value: premium });
    loadData();
  }
  

async function fileClaim() {
  const id = document.getElementById("claimPolicyId").value;
  const docHash = document.getElementById("claimDocHash").value;
  const accounts = await web3.eth.getAccounts();
  await contract.methods.fileClaim(id, docHash).send({ from: accounts[0] });
  loadData();
}

async function loadData() {
  const accounts = await web3.eth.getAccounts();
  const policies = await contract.methods.getMyPolicies().call({ from: accounts[0] });
  const claims = await contract.methods.getMyClaims().call({ from: accounts[0] });

  const myPolicies = document.getElementById("myPolicies");
  myPolicies.innerHTML = "";
  for (let pid of policies) {
    const p = await contract.methods.policies(pid).call();
    myPolicies.innerHTML += `<li>Policy ID: ${pid} | Vehicle: ${p.vehicleNumber} | Valid: ${new Date(p.policyEnd * 1000).toLocaleDateString()}</li>`;
  }

  const myClaims = document.getElementById("myClaims");
  myClaims.innerHTML = "";
  for (let cid of claims) {
    const c = await contract.methods.claims(cid).call();
    myClaims.innerHTML += `<li>Claim ID: ${cid} | Status: ${c.status} | Remark: ${c.adminRemark}</li>`;
  }
}
