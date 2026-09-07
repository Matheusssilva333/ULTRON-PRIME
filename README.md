# Ultron Prime

> **Personal Intelligence System** para engenharia, estudos, programação, automação e organização pessoal.

O Ultron Prime é um cockpit web inspirado em interfaces holográficas de ficção científica: um assistente visual com avatar geométrico, chat de texto, captura de voz no navegador e módulos para transformar objetivos em ações executáveis.

## O que já está implementado

- Dashboard principal com métricas de foco, estudos, automações e saúde do sistema.
- Avatar holográfico do Prime desenhado em SVG/CSS, com animações de scanline, anéis orbitais e estado de escuta.
- Chat de texto local com respostas demonstrativas e prompts rápidos.
- Chat de voz usando a Web Speech API quando o navegador oferece suporte.
- Workspace de estudos para a trilha de Analista de Sistemas — Infraestrutura, com foco em Transpetro e Petrobras.
- Workspace de engenharia e automação com manutenção preventiva, gerador de scripts e calculadora operacional.
- Rotinas e hábitos com checklist diário e modo foco.
- Projetos e código com linha do tempo de execução.
- Layout responsivo para desktop e mobile.
- GitHub Actions configurado para build e deploy no GitHub Pages.

## Rodar localmente

```bash
npm install
npm run dev
```

Para validar o build de produção:

```bash
npm run check
npm run build
```

## Deploy

O workflow em `.github/workflows/deploy.yml` é executado a cada push na branch `main`. Ele instala as dependências, executa o build Vite, publica `dist/public` como artefato e faz o deploy no GitHub Pages.

No repositório do GitHub, a configuração recomendada em **Settings → Pages** é **GitHub Actions** como fonte de build e deploy.

## Observações técnicas

Esta primeira versão é um protótipo front-end estático: as respostas do chat são locais e demonstrativas, e os dados não são persistidos em um servidor. A captura de voz usa o suporte nativo do navegador; em navegadores sem `SpeechRecognition`, o produto informa que o modo de voz não está disponível.

Para evoluir o Prime para um assistente completo, o próximo passo é adicionar uma camada segura de backend com autenticação, memória persistente, integração com um modelo de linguagem, agenda/tarefas e conectores de automação. Chaves de API não devem ser colocadas no front-end nem no GitHub Pages.

## Identidade visual

A interface combina **Space Grotesk** para títulos e **IBM Plex Mono** para metadados operacionais. O sistema usa azul-ciano holográfico para estados ativos, violeta para raciocínio/estudos e âmbar para automação, sobre uma base azul-marinho quase preta com grid técnico e transparências.
