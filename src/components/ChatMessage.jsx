const ChatMessage = ({ message }) => {
    if (message.memory === "Approved" || message.memory === "Rejected") {
        return (
            <p className="text-lg text-center text-gray-300 my-2">
                {message.content}
            </p>
        );
    }

    return (
        <div
            className={`p-5 rounded-xl shadow-md transition-all duration-300 max-w-[70%] 
            ${message.role === "user"
                ? "bg-neon-blue/20 border border-neon-blue text-white self-end shadow-neon-blue/50 ml-auto"
                : "bg-neon-purple/20 border border-neon-purple text-white self-start shadow-neon-purple/50 mr-auto"
            }`}
        >
            <p className="text-lg">{message.content}</p>
            {message.memory && (
                <p className="text-sm text-gray-400 mt-1">Memory Event: {message.memory}</p>
            )}
        </div>
    );
};

export default ChatMessage;
