export default () => ({
  app: {
    port: process.env.PORT || '3000',
    server_url: process.env.SERVER_URL || '',
    domain_web: process.env.APP_DOMAIN_WEB || 'localhost',
    salt_rounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
  },
});
