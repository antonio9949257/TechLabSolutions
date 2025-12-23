const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const https = require('https');
const { minioClient } = require('../config/minio');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

passport.use(new GoogleStrategy({
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  callbackURL: process.env.OIDC_REDIRECT_URI,
  scope: ['profile', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const baseNickname = email.split('@')[0];
      const nickname = `${baseNickname}-${Math.random().toString(36).substring(2, 6)}`;
      const profileName = profile.displayName || profile.name.givenName || baseNickname;
      const fallbackProfilePic = `https://ui-avatars.com/api/?name=${profileName.charAt(0)}&background=random`;

      user = await User.create({
        name: profileName,
        email: email,
        password: hashedPassword,
        nickname: nickname,
        role: 'cliente',
        profilePicture: fallbackProfilePic,
      });

      const googleProfilePicUrl = profile.photos?.[0]?.value;
      if (googleProfilePicUrl) {
        try {
          const { v4: uuidv4 } = await import('uuid');

          const imageBuffer = await new Promise((resolve, reject) => {
            https.get(googleProfilePicUrl, (response) => {
              if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
              }
              const chunks = [];
              response.on('data', (chunk) => chunks.push(chunk));
              response.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', (err) => {
              console.error('Google Strategy: Error downloading Google profile picture:', err);
              reject(err);
            });
          });

          const contentType = 'image/jpeg';
          const fileExtension = 'jpg';
          const filename = `profile-${user._id}-${uuidv4()}.${fileExtension}`;
          const bucketName = process.env.MINIO_BUCKET_NAME;

          await minioClient.putObject(bucketName, filename, imageBuffer, imageBuffer.length, { 'Content-Type': contentType });

          const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
          const minioHost = process.env.MINIO_ENDPOINT;
          const minioPort = process.env.MINIO_PORT;
          const minioUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;

          user.profilePicture = minioUrl;
          await user.save();

        } catch (uploadError) {
          console.error('Google Strategy: Failed to process Google profile picture. User will keep the fallback picture.', uploadError);
        }
      }
    } else {
      // Add logic to update profile picture for existing users
      const googleProfilePicUrl = profile.photos?.[0]?.value;
      if (googleProfilePicUrl && user.profilePicture.includes('ui-avatars.com')) { // Only update if it's a fallback picture
        try {
          const { v4: uuidv4 } = await import('uuid');

          const imageBuffer = await new Promise((resolve, reject) => {
            https.get(googleProfilePicUrl, (response) => {
              if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
              }
              const chunks = [];
              response.on('data', (chunk) => chunks.push(chunk));
              response.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', (err) => {
              console.error('Google Strategy: Error downloading Google profile picture for existing user:', err);
              reject(err);
            });
          });

          const contentType = 'image/jpeg';
          const fileExtension = 'jpg';
          const filename = `profile-${user._id}-${uuidv4()}.${fileExtension}`;
          const bucketName = process.env.MINIO_BUCKET_NAME;

          await minioClient.putObject(bucketName, filename, imageBuffer, imageBuffer.length, { 'Content-Type': contentType });

          const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
          const minioHost = process.env.MINIO_ENDPOINT;
          const minioPort = process.env.MINIO_PORT;
          const minioUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;

          user.profilePicture = minioUrl;
          await user.save();

        } catch (uploadError) {
          console.error('Google Strategy: Failed to process Google profile picture for existing user.', uploadError);
        }
      }
    }

    user.token = generateToken(user._id);
    return done(null, user);
  } catch (error) {
    console.error('Error during Google Strategy authentication:', error);
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;