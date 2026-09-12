export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prénom, réponse, avec_qui, timestamp, id } = req.body;

    if (!prénom || !réponse) {
      return res.status(400).json({ 
        result: 'error', 
        message: 'Données manquantes' 
      });
    }

    // L'URL du webhook Google Apps Script
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbwoXe5ukyJaVflM7B358yt_RRuV-jB0uPVEc7wz4ktwawFOZkgA3jCOxj4XZVA3fAA/exec';
    
    // Envoie les données au Google Apps Script
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'prénom': prénom,
        'réponse': réponse,
        'avec_qui': avec_qui || 'N/A',
        'timestamp': timestamp,
        'id': id
      })
    });

    const result = await response.json();

    if (result.result === 'success') {
      console.log(`✅ RSVP: ${prénom} - ${réponse}`);
      return res.status(200).json({ 
        result: 'success',
        message: 'Réponse enregistrée!'
      });
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      result: 'error', 
      message: error.message 
    });
  }
};
