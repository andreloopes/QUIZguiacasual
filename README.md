# Guia Interativo: 100 Melhores Restaurantes do Brasil (Edição 2026)

Bem-vindo ao repositório do **Guia Interativo dos 100 Melhores Restaurantes do Brasil**. Este é um projeto web moderno, responsivo e de alta performance desenvolvido inteiramente com **HTML5**, **Vanilla CSS** e **Vanilla JS (ES Modules)**, sem necessidade de ferramentas complexas de build (como Webpack, Vite ou Babel). 

Este guia foi estruturado de forma modular e limpa para que desenvolvedores de qualquer nível — especialmente iniciantes e juniores — possam compreender, dar manutenção e adicionar novas funcionalidades facilmente.

---

## 🚀 Como Rodar o Projeto Localmente

Como o projeto utiliza **ES Modules** nativos do JavaScript (usando `import` e `export`), o navegador exige que os arquivos sejam servidos por um servidor web por questões de segurança (CORS). Você **não** conseguirá rodar o projeto abrindo o arquivo `index.html` diretamente no navegador com dois cliques.

Siga os passos abaixo:

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado em sua máquina.

### 2. Instalação e Execução
No terminal, navegue até a pasta do projeto e execute:

```bash
# Instala as dependências de desenvolvimento (apenas o servidor local de testes)
npm install

# Inicia o servidor local de desenvolvimento
npm run dev
```

O terminal exibirá um endereço local (geralmente `http://localhost:8082` ou similar). Abra este endereço no navegador de sua preferência.

---

## 📁 Estrutura de Pastas e Arquivos

O projeto adota uma arquitetura limpa de separação de responsabilidades (SoC):

```text
├── index.html            # Estrutura base HTML e Sprite de ícones SVG
├── restaurants.json      # Banco de dados estático dos restaurantes 2026
├── package.json          # Script de automação e dependência de desenvolvimento (http-server)
├── README.md             # Este guia de documentação
├── styles/               # Folhas de estilo modularizadas
│   ├── base.css          # Variáveis (Design Tokens), resets e tipografia
│   ├── layout.css        # Estrutura geral (Header, Hero, Footer e contêiner principal)
│   ├── controls.css      # Barra de controles, filtros de busca e visualização (Lista/Grade)
│   ├── cards.css         # Estilização visual dos cartões de restaurantes
│   ├── filters.css       # Dropdowns de filtragem (Cidade, Culinária, Status)
│   ├── drawer.css        # Gaveta lateral ("Minhas Escolhas")
│   └── dialog.css        # Modais nativos (<dialog>) e notificações Toast
└── src/                  # Código lógico da aplicação (JavaScript Modular)
    ├── main.js           # Bootstrap da aplicação e escuta de eventos globais
    ├── state.js          # Estado central reativo da aplicação e persistência no LocalStorage
    ├── dom.js            # Cache dos elementos da página e gerador de ícones SVG
    ├── filters.js        # Lógica de processamento de filtros e tags
    ├── render.js         # Geração do código HTML para renderizar os cartões na tela
    ├── picks.js          # Lógica de favoritos (seleção, contagem e geração de URLs compartilhadas)
    ├── drawer.js         # Controle da gaveta lateral de favoritos e cópia de links
    ├── dialog.js         # Controle do modal de detalhes do restaurante e jurados
    ├── theme.js          # Lógica para alternar entre Tema Claro e Tema Escuro
    └── toast.js          # Notificações rápidas na tela (ex: "Link copiado!")
```

---

## 🧠 Arquitetura Lógica e Fluxo de Dados

Para dar manutenção no código de forma correta, é essencial entender como a informação flui pela aplicação:

1.  **Carregamento de Dados (`src/main.js`):** A aplicação faz um `fetch` assíncrono para obter as informações de [restaurants.json](file:///Users/andrelopes/Documents/Site/restaurants.json).
2.  **Estado Central (`src/state.js`):** Em vez de ler e escrever diretamente na tela (DOM) o tempo todo, mantemos um **Estado Central** na memória. Ele armazena quais filtros estão ativos, qual visualização está selecionada e os restaurantes favoritos ("Já fui" e "Quero ir").
3.  **Filtragem (`src/filters.js`):** Processa a lista com base nos critérios escolhidos e gera as tags de resumo.
4.  **Renderização Dinâmica (`src/render.js`):** Gera o código HTML dos cartões correspondentes e injeta no DOM de forma otimizada.
5.  **Persistência Local (`src/state.js`):** Salva as preferências de temas e favoritos no **LocalStorage** do navegador, para que permaneçam salvas mesmo se o usuário fechar a página.

---

## 🎨 Conceitos de Desenvolvimento Utilizados

Se você é um desenvolvedor júnior, atente-se às boas práticas aplicadas nas folhas de estilo e scripts:

*   **Design Tokens (Variáveis CSS):** No arquivo `styles/base.css`, todas as cores, fontes e transições são mapeadas em `:root`. Para alternar entre os temas Claro/Escuro, basta adicionar a classe `.light-theme` na tag `<body>`. As variáveis CSS sob a classe `body.light-theme` substituem os valores padrão, alterando a paleta de cores inteira instantaneamente.
*   **Segurança contra XSS:** Sempre que for renderizar texto vindo do JSON na tela, o valor passa pela função `escapeHtml()` em `src/dom.js`. Isso evita a injeção de scripts maliciosos.
*   **Sprites SVG:** Todos os ícones são agrupados em uma folha de sprites interna, sendo referenciados dinamicamente via `<use href="#icon-nome">` para otimizar requisições de rede.

---

## 🚢 Deploy Automatizado

O projeto está configurado para deploy automático no **GitHub Pages**.

Toda vez que você faz um `git push` para a branch principal (`main`), uma Action do GitHub (`.github/workflows/deploy.yml`) é disparada automaticamente. Ela reúne os arquivos e faz o deploy do site estático em minutos. Nenhuma configuração manual de servidor é necessária.
