import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const fetchChatMessages = async () => {
    const response = await axios.get(`${API_BASE_URL}/chat/0`);
    return response.data;
};

// Mock Approval (Without Wallet)
export const approveAccess = async () => {
    await axios.post(`${API_BASE_URL}/memory/approve-access`);
    return { status: "approved" };
};

// Approval with Wallet (EIP712 Signature)
export const approveAccessWithWallet = async ({ wallet, action, signature }) => {
    const response = await axios.post(`${API_BASE_URL}/memory/approve-access-wallet`, {
        wallet,
        action,
        signature,
    });

    if (!response.status === 200) {
        throw new Error("Failed to approve memory access with wallet");
    }

    return response.data;
};

// Reject Memory Access
export const rejectAccess = async () => {
    await axios.post(`${API_BASE_URL}/memory/reject-access`);
    return { status: "rejected" };
};

// Post a new chat message
export const postChatMessage = async (messageData) => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return response.json();
};
