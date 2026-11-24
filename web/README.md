# Firme

App pessoal para vencer a luxúria (Gálatas 5:1, “estai firmes”): contador de dias limpo, botão de pânico com respiração guiada,
desafio do mês com risquinhos na parede, diário de gatilhos, marcos e versículos.

- Código-fonte: `web/app.html`
- Gerar a versão instalável e o asset do Android: `node scripts/build.js`
- iPhone: abra https://peluzo13.github.io/peluzo-app1-teste/ no Safari → Compartilhar → Adicionar à Tela de Início. O ícone do Firme aparece na tela inicial.
- Publicação: o workflow `.github/workflows/pages.yml` publica a pasta `web/` a cada push na `main` (ative uma vez em Settings → Pages → Source: GitHub Actions).
- Android: o projeto em `app/` abre o mesmo app num WebView.

Os dados ficam só no aparelho (localStorage). Use Perfil → Backup para guardar uma cópia.
