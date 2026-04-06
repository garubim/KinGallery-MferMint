export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://kingallery.netlify.app';

  return Response.json({
    "accountAssociation": {
      "header": "eyJmaWQiOjM0OTY3NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFkN0YyYmRBQzhlMEI2MmY1ZDdCMmQxODQ1NGYxMjVBOTA4QzNGYWYifQ",
      "payload": "eyJkb21haW4iOiJraW5nYWxsZXJ5Lm5ldGxpZnkuYXBwIn0",
      "signature": "WhDoBJIEai/ysx0fAvberINt7AmxQZI7tXNzo9XgfWwpUhNoZwdi3lJ7hscLeON5O26i2wJXnjKRvEtoekJpEhw="
    },
    "frame": {
      "version": "1",
      "name": "KinGallery",
      "homeUrl": URL,
      "iconUrl": `${URL}/icon.png`,
      "imageUrl": `${URL}/hero1.png`,
      "buttonTitle": "Etch Your Mark",
      "splashImageUrl": `${URL}/splash.png`,
      "splashBackgroundColor": "#05080a",
      "webhookUrl": `${URL}/api/webhook`,
      "subtitle": "Etch Your Mark with kinGallery",
      "description": "Revolutionary NFT system where each mint creates entanglement magic for the next person. Mint on Base with zero gas fees.",
      "primaryCategory": "art-creativity",
      "heroImageUrl": `${URL}/hero1.png`,
      "tags": ["mint", "base", "nft", "legend", "mark"],
      "tagline": "Etch your Mark on Base",
      "ogTitle": "KinGallery - The Smile at 9h",
      "ogDescription": "Each mint creates entanglement Magic on KinGallery",
      "ogImageUrl": `${URL}/og.png`,
      "noindex": false
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300',
    }
  });
}
