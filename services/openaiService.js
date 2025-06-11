// backend/services/openaiService.js
// Generates content tags and hashtags using the OpenAI API.

const axios = require('axios');
const { OPENAI } = require('../constants'); // Import OpenAI configuration from constants

/**
 * Generate hashtags for a video using OpenAI completions.
 * @param {string} videoUrl - URL of the video.
 * @returns {Promise<string|null>} A string of hashtags or null on error.
 */
async function tagVideo(videoUrl) {
  try {
    // Call the OpenAI API endpoint using the endpoint from constants.
    const response = await axios.post(
      OPENAI.ENDPOINT,
      {
        prompt: `Tag the content of this video in keywords separated by commas: ${videoUrl}`,
        max_tokens: 30,
      },
      {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      }
    );
    const rawTags = response.data.choices[0].text.trim();
    // Convert comma-separated keywords into hashtags.
    const hashtags = rawTags.split(',').map(tag => `#${tag.trim()}`).join(' ');
    return hashtags;
  } catch (error) {
    console.error('Error tagging video:', error);
    return null;
  }
}

module.exports = tagVideo;
