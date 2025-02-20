const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { messages, addMessage, resetMessages } = require("./db");

const app = express();
const PORT = 4000;


const { ethers } = require("ethers");


app.use(cors());
app.use(bodyParser.json());

// EIP-712 Domain Information
const domain = {
    name: "ChatMemory",
    version: "1",
    chainId: 1, // Change for testnets
    verifyingContract: process.env.VERIFYING_CONTRACT || "0xYourContractAddressHere"
};

// EIP-712 Type Definitions
const types = {
    MemoryApproval: [
        { name: "user", type: "address" },
        { name: "timestamp", type: "uint256" },
        { name: "action", type: "string" }
    ]
};

// Store approved/rejected memory access (Temporary in-memory database)
const memoryApprovals = {};



// Fetch chat messages
app.get("/chat/0", (req, res) => {
    res.json({ messages });
});

// Approve memory access request (MOCK)
app.post("/memory/approve-access", (req, res) => {
    addMessage({ id: messages.length + 1, role: "bot", content: "Memory access Approved!", memory: "Approved" });
    res.json({ status: "Approved", messages });
});

// Approve memory access request (REAL WALLET)
app.post("/memory/approve-access-wallet", (req, res) => {
    const { wallet, action, signature } = req.body;
    console.log({ wallet, action, signature });

    if (!wallet || !action || !signature) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Memory access approved by: ${wallet}`);
    console.log(`Real Signature: ${signature}`);

    // Future: Verify signature here using Ethers.js or Web3.js

    addMessage({ id: messages.length + 1, role: "bot", content: "Memory access approved!", memory: "Approved" });
    res.json({ status: "approved", wallet, signature, messages });
});
// Reject memory access request
app.post("/memory/reject-access", (req, res) => {
    addMessage({ id: messages.length + 1, role: "bot", content: "Memory access denied!", memory: "Rejected" });
    res.json({ status: "rejected", messages });
});

// Restart simulation (reset messages)
app.post("/restart", (req, res) => {
    resetMessages();
    res.json({ status: "reset", messages });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});





