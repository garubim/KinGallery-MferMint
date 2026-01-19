# 🚀 Base.app Mini App - Deployment Checklist

**Status**: ⏳ Pronto para deploy após accountAssociation

## ✅ Implementado

### 1. Mini App SDK
- [x] `@farcaster/miniapp-sdk` instalado
- [x] `sdk.actions.ready()` com timeout de segurança (3s SDK + 4.5s total)
- [x] `sdk.actions.addFrame()` no botão "Save the Ritual"
- [x] `sdk.actions.close()` no botão X

### 2. Manifest File
- [x] Route criada em `/app/.well-known/farcaster.json/route.ts`
- [x] Todos os campos obrigatórios preenchidos:
  - name, homeUrl, iconUrl, splashImageUrl, splashBackgroundColor
  - subtitle, description, screenshotUrls, primaryCategory, tags
  - heroImageUrl, tagline, ogTitle, ogDescription, ogImageUrl

### 3. Metadata
- [x] `fc:miniapp` metadata no layout.tsx
- [x] Open Graph tags completos
- [x] Twitter Card configurado
- [x] Base.app meta tags (`eth:chain`, `eth:chainId`)

### 4. Mobile Optimization
- [x] `viewport-fit=cover` para safe areas
- [x] `apple-mobile-web-app-capable`
- [x] `theme-color` configurado

---

## ⏳ Pendente (Após Deploy)

### 5. Account Association
**IMPORTANTE**: Gerar **APÓS** fazer deploy em produção

1. Deploy do app para produção (Netlify/Vercel)
2. Acessar: https://www.base.dev/preview?tab=account
3. Colar URL do app (ex: kingallery.netlify.app)
4. Clicar "Submit" e depois "Verify"
5. Seguir instruções para gerar credenciais
6. Copiar os campos gerados (`header`, `payload`, `signature`)
7. Colar em `/app/.well-known/farcaster.json/route.ts` linha 4-8

**Arquivo atual** (linha 4-8):
```typescript
"header": "",      // ← Preencher após verificação
"payload": "",     // ← Preencher após verificação
"signature": ""    // ← Preencher após verificação
```

---

## 🧪 Testing & Validation

### 6. Preview Tool
Após deploy e account association, validar em:
https://www.base.dev/preview

**Validações**:
- [ ] Embed image aparece corretamente
- [ ] Botão "Mint Art" funciona
- [ ] App abre em fullscreen
- [ ] Splash screen aparece/desaparece (4.5s)
- [ ] Account association válida (tab "Account association")
- [ ] Metadata completa (tab "Metadata")

### 7. Teste Local
```bash
npm run dev
# Abrir localhost:3000
# Verificar:
# - Splash fecha em 4.5s
# - Console mostra: "✅ Farcaster SDK loaded successfully" OU "⚠️ SDK timeout"
# - App funciona normalmente
```

---

## 📤 Publish

### 8. Postar no Base App
**Após validação no Preview Tool**:

1. Abrir Base app
2. Criar novo post
3. Adicionar URL do app: `https://kingallery.netlify.app`
4. O embed deve aparecer automaticamente
5. Publicar

---

## 📋 URLs Importantes

- **Manifest**: `https://kingallery.netlify.app/.well-known/farcaster.json`
- **Account Association Tool**: https://www.base.dev/preview?tab=account
- **Preview Tool**: https://www.base.dev/preview
- **Base Docs**: https://docs.base.org/mini-apps

---

## 🔧 Comandos Úteis

```bash
# Deploy (Netlify)
git push origin main

# Validar manifest localmente
curl http://localhost:3000/.well-known/farcaster.json

# Limpar cache Next.js
rm -rf .next && npm run dev

# Build para produção
npm run build
npm start
```

---

## ⚠️ Troubleshooting

**Problema**: Account association falha
- **Solução**: Certificar que o app está em produção E o manifest está acessível na URL pública

**Problema**: Embed não aparece no Base app
- **Solução**: Verificar `fc:miniapp` metadata no layout.tsx e manifest completo

**Problema**: Splash não fecha
- **Solução**: Já implementado timeout de segurança de 4.5s + botões X/Save funcionais

**Problema**: SDK timeout warning
- **Solução**: Normal quando não está no Farcaster app, app continua funcionando

---

## ✅ Checklist Final Antes de Publicar

- [ ] App deployed em produção
- [ ] Manifest acessível em `/.well-known/farcaster.json`
- [ ] Account association gerada e preenchida
- [ ] Testado no Base Build Preview Tool
- [ ] Embed aparece corretamente
- [ ] Botão launch abre o app
- [ ] Splash screen funciona (4.5s)
- [ ] Magic Button conecta wallet
- [ ] Mint transaction funciona

**Após tudo ✅**: Postar no Base app para publicar! 🚀
