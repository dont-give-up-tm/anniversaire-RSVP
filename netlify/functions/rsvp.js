exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Not allowed' };
  }

  try {
    const body = new URLSearchParams(event.body);
    const prenom = body.get('prénom') || '';
    const reponse = body.get('réponse') || '';
    const timestamp = new Date().toISOString();

    if (!prenom || !reponse) {
      return {
        statusCode: 400,
        body: JSON.stringify({ result: 'error', message: 'Données manquantes' })
      };
    }

    console.log(`✅ RSVP: ${prenom} | ${reponse} | ${timestamp}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        result: 'success',
        message: 'Réponse enregistrée!'
      })
    };

  } catch (error) {
    console.error('❌ Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ result: 'error', message: error.message })
    };
  }
};
