exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Not allowed' };
  }

  try {
    const body = new URLSearchParams(event.body);
    const prenom = body.get('prénom') || '';
    const reponse = body.get('réponse') || '';
    const avecQui = body.get('avec_qui') || 'N/A';
    const timestamp = body.get('timestamp') || new Date().toISOString();
    const userId = body.get('id') || 'unknown';

    if (!prenom || !reponse) {
      return {
        statusCode: 400,
        body: JSON.stringify({ result: 'error', message: 'Données manquantes' })
      };
    }

    // ⚠️ REMPLACE PAR TON URL WEBHOOK (Étape 3 ci-dessus)
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbwoXe5ukyJaVflM7B358yt_RRuV-jB0uPVEc7wz4ktwawFOZkgA3jCOxj4XZVA3fAA/exec';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'prénom': prenom,
        'réponse': reponse,
        'avec_qui': avecQui,
        'timestamp': timestamp,
        'id': userId
      })
    });

    const result = await response.json();

    if (result.result === 'success') {
      console.log(`✅ RSVP: ${prenom} - ${reponse} - ${userId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          result: 'success',
          message: 'Réponse enregistrée!'
        })
      };
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ result: 'error', message: error.message })
    };
  }
};
