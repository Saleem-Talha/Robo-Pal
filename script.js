const API_KEY = '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';
const submitButton = document.querySelector('#submit');
const outputContainer = document.querySelector('.output-container');
const outputElement = outputContainer.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const historyElementMob = document.querySelector('.history-mob');
const buttonElement = document.querySelector('.new-chat');
const buttonElementMob = document.querySelector('.new-chat-mob');
const loader = document.querySelector('#loader');
const gridContainer = document.querySelector('.grid-container');
const menuImg = document.querySelector('.menu');
const speakerImg = document.querySelector('.speaker');
const overlay = document.getElementById('overlay'); // Reference to the overlay div


let isMenuOpen = false;


menuImg.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;

  // Toggle the overlay's visibility and animation class
  if (isMenuOpen) {
    overlay.style.display = "block"; // Show the overlay
    overlay.style.animation = "none"; // Remove animation
    void overlay.offsetWidth; // Trigger reflow to apply styles without animation
    overlay.style.animation = "fadeInRightBig 1s"; // Add animation back
  } else {
    overlay.style.animation = "fadeOutRightBig 1s"; // Add fade-out animation
    setTimeout(() => {
      overlay.style.display = "none"; // Hide the overlay after the animation
    }, 1000); // Adjust the delay to match your animation duration
  }
});



buttonElementMob.addEventListener('click', clearChat); // Clear chat when the "New Chat" button is clicked for mobile

historyElementMob.addEventListener('click', (event) => { // Handle history clicks for mobile
  if (event.target && event.target.tagName === 'P') {
    const clickedMessage = event.target.textContent;
    changeInput(clickedMessage);
  }
});

function changeInput(value) {
  const inputElement = document.querySelector('input');
  inputElement.value = value;
}

async function getMessage() {
  loader.style.display = 'block';
  submitButton.style.display = 'none';
  console.log('clicked');
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: inputElement.value }]
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);
    const aiResponse = data.choices[0].message.content;
    loader.style.display = 'none';
    // Display AI response and show the output container
    outputElement.textContent = aiResponse;
    outputContainer.style.display = 'block';
    submitButton.style.display = 'block';
    gridContainer.style.display = 'none';
    
    if (aiResponse && inputElement.value) {
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');
    
      const userMessage = document.createElement('p');
      userMessage.textContent = inputElement.value;
      userMessage.addEventListener('click', () => changeInput(userMessage.textContent));
    
      const historyImage = document.createElement('img');
      historyImage.src = './images/history.png'; // Set the image source here
      historyImage.style.width = '20px';
      historyItem.appendChild(historyImage);
      historyItem.appendChild(userMessage);
    
      // Append the historyItem to historyElement
      historyElement.append(historyItem);
    
      // Clone the historyItem and append the clone to historyElementMob
      const historyItemClone = historyItem.cloneNode(true);
      historyElementMob.appendChild(historyItemClone);
    }
    
  } catch (error) {
    console.log(error);
  }
}

submitButton.addEventListener('click', getMessage);

function clearInput() {
  inputElement.value = '';
}
buttonElement.addEventListener('click', clearInput);

function changeInput(value) {
  const inputElement = document.querySelector('input');
  inputElement.value = value;
}

historyElement.addEventListener('click', (event) => {
  if (event.target && event.target.tagName === 'P') {
    const clickedMessage = event.target.textContent;
    changeInput(clickedMessage);
  }
});


function clearChat() {
  inputElement.value = ''; // Clear the input field
  outputContainer.style.display = 'none'; // Hide the AI's response
  outputElement.textContent = ''; // Clear the AI's response text
   // Remove all child elements from the history container
   gridContainer.style.display = 'grid';
}


buttonElement.addEventListener('click', clearChat);
buttonElementMob.addEventListener('click', clearChat);

// ... Your existing code ...

function sendGridItemTextToAI(text) {
  // Clear the input field and hide the output container
  inputElement.value = '';
  outputContainer.style.display = 'none';
  outputElement.textContent = '';

  // Set the text from the grid item into the input field
  inputElement.value = text;

  // Trigger the AI message retrieval by simulating a click on the submit button
  submitButton.click();
}

// Add click event listeners to the grid items
gridContainer.addEventListener('click', (event) => {
  if (event.target && event.target.tagName === 'H3') {
      // Get the text inside the clicked grid item
      const gridItemText = event.target.textContent;

      // Send the grid item text to the AI
      sendGridItemTextToAI(gridItemText);
  }
});

let isSpeaking = false; // Variable to track whether text-to-speech is active
const customButton = document.querySelector('.custom-button'); // Get the button element

// Function to convert text to speech
function textToSpeech(text) {
    // Create a new SpeechSynthesisUtterance object
    const speech = new SpeechSynthesisUtterance();
    
    // Set the text to be spoken
    speech.text = text;
    
    // Use the default voice
    speech.voice = speechSynthesis.getVoices()[0];
    
    // Speak the text
    speechSynthesis.speak(speech);
    
    // Add an event listener to detect when speech is finished
    speech.addEventListener('end', () => {
        isSpeaking = false; // Reset the flag when speech is finished
        customButton.textContent = 'Text to Speech'; // Change button text back to "Text to Speech"
        
    });
}

// Function to toggle text-to-speech
function toggleTextToSpeech() {
    const outputText = outputElement.textContent;

    if (isSpeaking) {
        // If speaking, stop speech
        speechSynthesis.cancel();
        isSpeaking = false;
        customButton.textContent = 'Text to Speech'; // Change button text back to "Text to Speech"
        speakerImg.style.display='flex';
    } else if (outputText) {
        // If not speaking, start speech
        textToSpeech(outputText);
        isSpeaking = true;
        customButton.textContent = 'Stop'; // Change button text to "Stop"
        speakerImg.style.display='flex';
    }
}

// Add a click event listener to the custom button to toggle text-to-speech
customButton.addEventListener('click', () => {
    toggleTextToSpeech();
});

// Function to toggle between Dark and Light Themes
function toggleTheme() {
  if (document.body.classList.contains('dark-theme')) {
    // Switch to Light Theme
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    // Switch to Dark Theme
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
}

// Add event listener for Toggle Theme button
document.getElementById('toggleThemeButton').addEventListener('click', toggleTheme);
