export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://kingallery.netlify.app';
  
  return Response.json({
    "accountAssociation": {
      // IMPORTANTE: Generate on https://www.base.dev/preview?tab=account
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
      "name": "KinGallery",
      "homeUrl": URL,
      "iconUrl": `${URL}/icon-etch.png`,
      "splashImageUrl": `${URL}/splash.png`,
      "splashBackgroundColor": "#05080a",
      "webhookUrl": `${URL}/api/webhook`,
      "subtitle": "Revolutionary collaborative NFT entanglement on Base",
      "description": "Revolutionary NFT system where each mint creates entanglement magic for the next person. Mint on Base with zero gas fees.",
      "screenshotUrl":
        `${URL}/KinGallery-ScreenShot01.png`,
      "primaryCategory": "art-creativity",
      "tags": ["art", "nft", "base", "entanglement", "collaborative", "ritual", "revolutionary", "mfer"],
      "heroImageUrl": `${URL}/hero.png`,
      "tagline": "Etch your Mark on Base",
      "ogTitle": "KinGallery - The Smile at 9h",
      "ogDescription": "Each mint creates entanglement Magic on KinGallery",
      "ogImageUrl": `${URL}/og.png`,
      "noindex": false
    }
  });
}
