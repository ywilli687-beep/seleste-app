import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const keyMatch = envFile.match(/ANTHROPIC_API_KEY="?([^"\n]+)"?/);
const key = keyMatch ? keyMatch[1] : '';

fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      { "role": "user", "content": "Hello, world" }
    ]
  })
})
  .then(res => res.json())
  .then(json => console.log(JSON.stringify(json, null, 2)))
  .catch(err => console.error(err));
