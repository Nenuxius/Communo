let localStream;
let remoteStream;
let peerConnection;

const chatBox = document.getElementById("chat-box");

document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function startVideoChat() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    // Initialize peer connection
    peerConnection = new RTCPeerConnection();
    
    // Add local stream to peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    peerConnection.ontrack = event => {
        remoteStream = event.streams[0];
        document.getElementById("remoteVideo").srcObject = remoteStream;
    };

    // Create an offer to connect
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // Send offer to the other peer using your signaling mechanism
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();

    if (message) {
        // Display the user's message
        displayMessage(message, "user");

        // Simulate a response from a random user (for demo purposes)
        setTimeout(() => {
            const response = generateRandomResponse();
            displayMessage(response, "other");
        }, 1000); // Simulate a delay for response

        inputField.value = ""; // Clear the input field
    }
}

function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function generateRandomResponse() {
    const responses = [
        "Hello there!",
        "How are you?",
        "What are you up to?",
        "Nice to meet you!",
        "Tell me something interesting!"
    ];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Start the video chat when the page loads
window.onload = startVideoChat;
