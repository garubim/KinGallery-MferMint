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
      "name": "KinGallery - Entanglement System",
      "homeUrl": URL,
      "iconUrl": `${URL}/icon.png`,
      "splashImageUrl": `${URL}/splash.png`,
      "splashBackgroundColor": "#05080a",
      "webhookUrl": `${URL}/api/webhook`,
      "subtitle": "Revolutionary collaborative NFT entanglement on Base",
      "description": "Experience the world's first collaborative entanglement system. Each mint creates magic for the next person in an eternal circular pattern. Deploy #6 with revolutionary entanglement now live on Base with gas sponsorship.",
      "screenshotUrls": [
        `${URL}/hero.png`,
        `${URL}/entanglement-demo.png`
      ],
      "primaryCategory": "social",
      "tags": ["art", "nft", "base", "entanglement", "collaborative", "ritual", "revolutionary", "mfer"],
      "heroImageUrl": `${URL}/hero.png`,
      "tagline": "Each mint creates magic for the next person 🔮",
      "ogTitle": "KinGallery - Revolutionary Entanglement System",
      "ogDescription": "World's first collaborative NFT entanglement. Each mint generates magic for the next person in an eternal circle. #1000 → #1",
      "ogImageUrl": `${URL}/hero.png`,
      "noindex": false
    }
  });
}
