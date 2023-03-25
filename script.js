// Get the chatbot elements
var chatbotContainer = document.querySelector('.chatbot-container');
var chatbotHeader = chatbotContainer.querySelector('.chatbot-header');
var chatbotChatbox = chatbotContainer.querySelector('.chatbot-chatbox');
var chatbotInput = chatbotContainer.querySelector('.chatbot-input');
var chatbotForm = chatbotContainer.querySelector('.chatbot-form');
var chatbotInputField = chatbotContainer.querySelector('.chatbot-input-field');

// Create an array to store the chat messages
var chatMessages = [];

// Function to add a message to the chatbot chatbox
function addMessage(role, content) {
	// Create a new message element
	var message = document.createElement('p');
	message.textContent = content;

	// Add a class to the message element based on the role (system, user, bot)
	message.classList.add('chatbot-message', role + '-message');

	// Add the message element to the chatbox
	chatbotChatbox.appendChild(message);

	// Scroll to the bottom of the chatbox
	chatbotChatbox.scrollTop = chatbotChatbox.scrollHeight;
}

// Function to handle form submission
function handleSubmit(event) {
	// Prevent the default form submission
	event.preventDefault();

	// Get the user input from the input field
	var userInput = chatbotInputField.value;

	// Add the user input to the chat messages array
	chatMessages.push({ role: 'user', content: userInput });

	// Add the user input message to the chatbot chatbox
	addMessage('user', userInput);

	// Clear the input field
	chatbotInputField.value = '';

	// Send a request to the OpenAI API
	fetch('https://api.openai.com/v1/engine/davinci-codex/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer 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'
		},
		body: JSON.stringify({
			prompt: chatMessages.map(function (message) {
				return message.role === 'bot' ? 'Bot: ' + message.content : 'User: ' + message.content;
			}).join('\n') + '\nBot:',
			max_tokens: 50,
			model: 'davinci-codex',
			stop: 'Bot:'
		})
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			// Get the bot response from the API response
			var botResponse = data.choices[0].text.trim();

			// Add the bot response to the chat messages array
			chatMessages.push({ role: 'bot', content: botResponse });

			// Add the bot response message to the chatbot chatbox
			addMessage('bot', botResponse);
		})
		.catch(function (error) {
			// Add an error message to the chatbot chatbox
			addMessage('system', 'Oops! Something went wrong. Please try again later.');
			console.error(error);
		});
}

// Attach an event listener to the form submit event
chatbotForm.addEventListener('submit', handleSubmit);
