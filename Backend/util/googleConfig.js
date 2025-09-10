const { google } = require("googleapis");
const GOOGLE_CLIENT_ID = "462576015706-r4o1bb51h6luatb39goilu921jbj3uvl.apps.googleusercontent.com"

const GOOGLE_CLIENT_SECRET = "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"

exports.oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
)
