const motivationalQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  // ... (include all 50 quotes)
  {
    text: "The only way to achieve the impossible is to believe it is possible.",
    author: "Charles Kingsleigh"
  }
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

module.exports = {
  motivationalQuotes,
  getRandomQuote
};