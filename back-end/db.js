let messages = [
    { id: 1, role: "user", content: "Hello, how are you?", memory: null },
    { id: 2, role: "bot", content: "I'm doing great! How can I help you?", memory: null },
    { id: 3, role: "user", content: "Can you remember this?", memory: "Requesting memory access..." }
];

module.exports = {
    messages,
    addMessage: (message) => messages.push(message),
    resetMessages: () => {
        messages = [
            { id: 1, role: "user", content: "Hello, how are you?", memory: null },
            { id: 2, role: "bot", content: "I'm doing great! How can I help you?", memory: null },
            { id: 3, role: "user", content: "Can you remember this?", memory: "Requesting memory access..." }
        ];
    }
};
