
const greetingResponses = [
  "Hello there! How can I help you today?",
  "Hi there! What can I do for you today?",
  "Good morning/afternoon/evening! How can I assist you?",
];

const defaultResponses = [
  "I'm not sure how to respond. Please try rephrasing your message. Alternatively, type 'hints' for some available services.",
  "I'm sorry, I didn't understand. Try rephrasing or type 'hints' for some services.",
  "I'm not sure what you're asking. Could you rephrase or try typing 'hints' for options?",
];

const optionalResponses = [
  "yup, Would you have a Riddle or Joke ?",
  "Would you like to have some Riddles or Jokes here ?",
  "Do you preffer a Riddle or Joke ?",
];

export function generateResponse(
  message: string,
  toggleVisibility: () => void
) {
  if (message.toLowerCase().includes("hello")) {
    return greetingResponses[
      Math.floor(Math.random() * greetingResponses.length)
    ];
  } else if (message.toLowerCase().includes("hints")) {
    return (
      toggleVisibility(),
      optionalResponses[Math.floor(Math.random() * optionalResponses.length)]
    );
  } else {
    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }
}

// can use useEffect with EventListener("keydown", (event)
// later to check every response in more functional way
