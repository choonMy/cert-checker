import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: process.env.PORT,


  pwdSecret: process.env.PWD_SECRET,
  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  googleApiKey: process.env.GOOGLE_API_KEY,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    smtpPort: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN,
    cc: process.env.EMAIL_CC
  },
  sms: {
    baseUrl: process.env.SMS_BASE_URL,
    user: process.env.SMS_USER,
    pwd: process.env.SMS_PWD,
    endpoint : process.env.SMS_ENDPOINT,
    apiKey : process.env.SMS_API_KEY
  },
  websiteUrl: process.env.WEBSITE_URL,
  prosales: {
    token: process.env.NODE_ENV === 'production' ? process.env.PROSALES_AUTH_TOKEN_LIVE : process.env.PROSALES_AUTH_TOKEN_STAGING,
    api: process.env.NODE_ENV === 'production' ? process.env.PROSALES_API_LIVE : process.env.PROSALES_API_STAGING
  },
};
