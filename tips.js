exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');
  const { bestemming, weerTekst, chatModus, geschiedenis } = body;

  if (!bestemming || !weerTekst) {
    return { statusCode: 400, body: JSON.stringify({ fout: 'Missende parameters' }) };
  }

  try {
    let systemPrompt, messages;

    if (chatModus && geschiedenis && geschiedenis.length) {
      systemPrompt = `Je bent een vriendelijke persoonlijke reisgids voor ${bestemming}.
Actueel weer: ${weerTekst}
Antwoord in het Nederlands, bondig (max 3-4 zinnen), concreet en weersgerelateerd. Spreek de reiziger aan met je/jij.`;
      messages = geschiedenis;
    } else {
      systemPrompt = `Je bent een reistips-generator. Antwoord uitsluitend als geldige JSON array zonder markdown of extra tekst.`;
      messages = [{
        role: 'user',
        content: `Genereer 5 reistips voor ${bestemming} op basis van dit actuele weer:\n${weerTekst}\n\nJSON formaat (exact):\n[{"icon":"emoji","categorie":"type","titel":"korte titel","tekst":"2 zinnen concreet advies gebaseerd op het weer"}]`
      }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const tekst = data.content?.[0]?.text || '';

    if (chatModus) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ antwoord: tekst })
      };
    } else {
      const tips = JSON.parse(tekst.replace(/```json|```/g, '').trim());
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tips })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ fout: err.message })
    };
  }
};
