export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://kingallery.netlify.app';
  
  return Response.json({
    "accountAssociation": {
      // IMPORTANTE: Gerar em https://www.base.dev/preview?tab=account
      // 1. Deploy o app em produção
      // 2. Cole sua URL no Base Build Account Association Tool
      // 3. Clique "Verify" e siga as instruções
      // 4. Cole os valores gerados aqui
      "header": "",
      "payload": "",
      "signature": ""
    },
    "miniapp": {
      "version": "1",
      "name": "KinGallery - The Smile at 9h",
      "homeUrl": URL,
      "iconUrl": `${URL}/icon.png`,
      "splashImageUrl": `${URL}/splash.png`,
      "splashBackgroundColor": "#05080a",
      "webhookUrl": `${URL}/api/webhook`,
      "subtitle": "This is not animation; it's a ritual",
      "description": "The art isn't in the spin; it's in that precise moment of recognition. Mint the Smile at 9h on Base with gas sponsorship.",
      "screenshotUrls": [
        `${URL}/hero.png`
      ],
      "primaryCategory": "social",
      "tags": ["art", "nft", "base", "ritual", "kinmutable"],
      "heroImageUrl": `${URL}/hero.png`,
      "tagline": "Save the ritual on your profile",
      "ogTitle": "KinGallery - The Smile at 9h",
      "ogDescription": "This is not animation; it's a ritual. Mint art on Base.",
      "ogImageUrl": `${URL}/hero.png`,
      "noindex": false
    }
  });
}
