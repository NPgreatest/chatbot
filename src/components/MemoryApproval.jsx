import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { approveAccess, approveAccessWithWallet, rejectAccess } from "../api/chatApi";
import { ethers } from "ethers";

const MemoryApproval = () => {
    const queryClient = useQueryClient();
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [isSigning, setIsSigning] = useState(false);

    const approveMutation = useMutation(approveAccess, {
        onSuccess: () => {
            queryClient.invalidateQueries("chatMessages");
            setIsWalletOpen(false);
        },
    });

    const approveWithWalletMutation = useMutation(approveAccessWithWallet, {
        onSuccess: () => {
            queryClient.invalidateQueries("chatMessages");
            setIsWalletOpen(false);
        },
    });

    const rejectMutation = useMutation(rejectAccess, {
        onSuccess: () => {
            queryClient.invalidateQueries("chatMessages");
            setIsWalletOpen(false);
        },
    });

    const handleApproveClick = (action) => {
        setPendingAction(action);
        setIsWalletOpen(true);
    };

    const handleMockSign = () => {
        const mockSignature = `mock_signature_${Date.now()}`;
        if (pendingAction === "approve") {
            approveMutation.mutate({ wallet: "0xMockWalletAddress", action: pendingAction, signature: mockSignature });
        } else {
            rejectMutation.mutate({ wallet: "0xMockWalletAddress", action: pendingAction, signature: mockSignature });
        }
    };

    const signWithWallet = async () => {
        if (!window.ethereum) {
            alert("Please install a MetaMask wallet!");
            return;
        }
    
        try {
            setIsSigning(true);
    
            // Connect to wallet
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Ensure account connection
            const signer = await provider.getSigner();
    
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAddress(accounts[0]);
    
            const domain = {
                name: "ChatMemory",
                version: "1",
                chainId: 1, // Adjust if using a testnet
                verifyingContract: "0x5d681CFab91412DCeD885dC0DE9A724b8C1017B1", // Replace with actual contract address
            };
    
            const types = {
                MemoryApproval: [
                    { name: "user", type: "address" },
                    { name: "timestamp", type: "uint256" },
                    { name: "action", type: "string" },
                ],
            };
    
            const value = {
                user: accounts[0],
                timestamp: Math.floor(Date.now() / 1000),
                action: pendingAction, // "approve" or "reject"
            };
    
            console.log("Signing Data:", { domain, types, value });
    
            // Sign the structured data
            const signature = await signer.signTypedData(domain, types, value);
    
            console.log("Signature:", signature);
    
            approveWithWalletMutation.mutate({
                wallet: accounts[0],
                action: pendingAction,
                signature,
            });
    
        } catch (error) {
            console.error("Wallet signing failed:", error);
            alert("Failed to sign the transaction.");
        } finally {
            setIsSigning(false);
        }
    };
    

    return (
        <div className="flex gap-6">
            <button
                onClick={() => handleApproveClick("approve")}
                className="px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300
                bg-neon-green/20 border border-neon-green text-black
                shadow-neon-green/50 hover:shadow-neon-green hover:bg-neon-green/40"
            >
                Approve
            </button>
            <button
                onClick={() => handleApproveClick("reject")}
                className="px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300
                bg-neon-red/20 border border-neon-red text-black
                shadow-neon-red/50 hover:shadow-neon-red hover:bg-neon-red/40"
            >
                Reject
            </button>

            {isWalletOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-center">Confirm Memory Access</h3>
                        <p className="text-center mb-4">
                            You are about to {pendingAction === "approve" ? "approve" : "reject"} memory access.
                        </p>
                        <div className="flex flex-col space-y-4">
                            {/* Confirm without Wallet (Mock Signature) */}
                            <button
                                onClick={handleMockSign}
                                className="px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-green-700"
                            >
                                Confirm (Without Wallet)
                            </button>

                            {/* Confirm with Wallet (EIP712 Signature) */}
                            <button
                                onClick={signWithWallet}
                                disabled={isSigning}
                                className="px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-blue-700"
                            >
                                {isSigning ? "Signing..." : "Confirm with Wallet"}
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={() => setIsWalletOpen(false)}
                                className="px-4 py-2 bg-neon-red text-black rounded-lg hover:bg-red-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryApproval;
