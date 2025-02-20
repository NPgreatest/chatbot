import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchChatMessages, postChatMessage } from "../api/chatApi";
import ChatMessage from "./ChatMessage";
import MemoryApproval from "./MemoryApproval";

const ChatWindow = () => {
    const queryClient = useQueryClient();
    const { data, error, isLoading } = useQuery("chatMessages", fetchChatMessages);
    const [message, setMessage] = useState("");

    const mutation = useMutation(postChatMessage, {
        onSuccess: () => {
            queryClient.invalidateQueries("chatMessages");
            setMessage(""); // Clear input after sending
        }
    });

    const handleSendMessage = () => {
        if (message.trim()) {
            mutation.mutate({ content: message });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    if (isLoading) return <p className="text-neon-green text-center text-xl">Loading messages...</p>;
    if (error) return <p className="text-neon-red text-center text-xl">Error fetching messages.</p>;

    // Check if any message contains a memory approval status
    const hasMemoryApproval = data.messages.some(
        (message) => message.memory === "Approved" || message.memory === "Rejected"
    );

    return (
        <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-md bg-black/50 border border-neon-blue shadow-xl shadow-neon-blue/50">
            <h2 className="text-3xl font-bold text-white mb-5 text-center neon-text">Chat Messages</h2>
            <div className="flex flex-col space-y-4 h-[60vh] overflow-y-auto px-4">
                {data.messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
            </div>

            {/* Approval / Rejection Section */}
            <div className="flex justify-center mt-6">
                {!hasMemoryApproval && <MemoryApproval />}
            </div>

            {/* Chat Input Box */}
            <div className="flex items-center mt-4 border-t border-neon-blue pt-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 rounded-lg bg-black text-white border border-neon-blue focus:outline-none focus:ring focus:ring-neon-blue"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-4 px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
