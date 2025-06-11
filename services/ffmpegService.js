// backend/services/ffmpegService.js
// Processes video files using FFmpeg via the fluent-ffmpeg library.

const ffmpeg = require('fluent-ffmpeg');
const { FFMPEG } = require('../constants'); // Import FFmpeg configuration from constants

/**
 * Process a video file with specified FFmpeg options.
 * @param {string} inputPath - Path to the source video.
 * @param {string} outputPath - Path where the processed video will be saved.
 * @returns {Promise} Resolves when processing is complete.
 */
function processVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        FFMPEG.VIDEO_CODEC,  // e.g., "-c:v libx264"
        FFMPEG.PRESET,       // e.g., "-preset fast"
        FFMPEG.CRF,          // e.g., "-crf 22"
        FFMPEG.AUDIO_CODEC   // e.g., "-c:a aac"
      ])
      .save(outputPath)
      .on('end', () => {
        console.log('Video processing finished.');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing video:', err);
        reject(err);
      });
  });
}

module.exports = processVideo;
