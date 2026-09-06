const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    // Parse les données du formulaire
    const body = JSON.parse(event.body);
    const prenom = body.prénom || '';
    const reponse = body.réponse || '';
    const timestamp = new Date().toISOString();
    
    if (!prenom || !reponse) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Données manquantes' })
      };
    }

    // Initialise Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs'
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Ajoute la ligne au Sheet
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:D';

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[prenom, reponse, timestamp, '']]
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        result: 'success',
        message: 'Réponse enregistrée!'
      })
    };

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        result: 'error',
        message: error.message
      })
    };
  }
};