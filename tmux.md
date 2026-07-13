# Tmux - Cheat Sheet de Comandos

**Prefixo padrão:** `Ctrl + b`  
(pressione `Ctrl + b`, solte e depois pressione a tecla do comando)

> Muitos usuários preferem mudar o prefixo para `Ctrl + a` (mais ergonômico).

---

## 📦 Instalação Rápida

```bash
# Ubuntu / Debian / Pop!_OS
sudo apt update && sudo apt install tmux -y

# Arch Linux / Manjaro
sudo pacman -S tmux

# Fedora
sudo dnf install tmux

# macOS (com Homebrew)
brew install tmux
```

---

## 🧠 Conceitos Básicos

| Conceito   | O que é?                                                                 |
|------------|--------------------------------------------------------------------------|
| **Sessão** | Container principal. Pode ter várias janelas. Pode ser desanexada e retomada depois. |
| **Janela** | Como uma "aba" do terminal. Cada janela pode conter vários painéis.       |
| **Painel** | Divisão da tela (split). Permite ver vários terminais ao mesmo tempo.    |

---

## 🚀 Comandos de Sessão (fora do tmux)

| Comando                              | Descrição                                      |
|--------------------------------------|------------------------------------------------|
| `tmux`                               | Inicia uma nova sessão                         |
| `tmux new -s nome-da-sessao`         | Cria sessão com nome                           |
| `tmux attach -t nome-da-sessao`      | Anexa (conecta) em uma sessão existente        |
| `tmux attach`                        | Anexa na última sessão usada                   |
| `tmux ls`                            | Lista todas as sessões ativas                  |
| `tmux kill-session -t nome`          | Mata uma sessão específica                     |
| `tmux kill-server`                   | Mata **todas** as sessões (use com cuidado!)   |

---

## ⌨️ Comandos Dentro do Tmux

> **Lembrete:** Sempre pressione `Ctrl + b` primeiro e depois a tecla indicada.

### 🪟 Janelas (Windows)

| Tecla       | Ação                                          |
|-------------|-----------------------------------------------|
| `c`         | Criar nova janela                             |
| `n`         | Ir para a próxima janela                      |
| `p`         | Ir para a janela anterior                     |
| `0` a `9`   | Ir diretamente para a janela de número X      |
| `w`         | Listar todas as janelas (modo interativo)     |
| `,`         | Renomear a janela atual                       |
| `&`         | Fechar (matar) a janela atual                 |

### 🪟 Painéis (Panes / Splits)

| Tecla          | Ação                                                      |
|----------------|-----------------------------------------------------------|
| `%`            | Dividir **horizontalmente** (lado a lado)                 |
| `"`            | Dividir **verticalmente** (um em cima do outro)           |
| `o`            | Alternar entre os painéis                                 |
| `←` `→` `↑` `↓` | Mover para o painel na direção da seta                  |
| `x`            | Fechar o painel atual (pede confirmação)                  |
| `z`            | Maximizar / restaurar o painel atual                      |
| `Space`        | Alternar entre layouts de painéis                         |
| `q`            | Mostrar números dos painéis (pressione o número para ir)  |

### 📋 Modo de Cópia e Scroll

| Tecla              | Ação                                              |
|--------------------|---------------------------------------------------|
| `[`                | Entrar no modo de cópia / scroll                  |
| `q`                | Sair do modo de cópia                             |
| `Ctrl + b` + `[`   | Iniciar seleção de texto (no modo cópia)          |
| `Enter`            | Copiar o texto selecionado                        |
| `]`                | Colar o texto copiado                             |

**Dica:** No modo cópia você pode navegar com as setas ou usar atalhos do `vi` (se configurado).

### 🔧 Outros Comandos Úteis

| Tecla       | Ação                                              |
|-------------|---------------------------------------------------|
| `d`         | **Desanexar** da sessão (detach)                  |
| `?`         | Mostrar todos os comandos disponíveis (help)      |
| `:`         | Abrir o prompt de comando do tmux                 |
| `t`         | Mostrar um relógio grande na tela                 |
| `$`         | Renomear a sessão atual                           |
| `s`         | Mostrar lista de sessões (árvore)                 |

---

## 💡 Dicas de Ouro

- Use `tmux new -s projeto` para dar nome às sessões (fica muito mais organizado)
- `prefix + d` é seu melhor amigo para sair sem matar os processos
- Instale o plugin **tmux-resurrect** para salvar e restaurar sessões após reiniciar o computador
- Use **tmuxinator** ou **tmuxp** para gerenciar projetos complexos com múltiplas janelas/painéis
- Pressione `prefix + q` e depois um número para pular rapidamente entre painéis

---