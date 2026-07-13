# Terminal Linux - Comandos Essenciais

**Guia rápido e prático** dos comandos mais usados no dia a dia no terminal Linux.

> Ideal para iniciantes e como referência rápida (cheat sheet).

---

## 📍 Navegação e Diretórios

| Comando              | Descrição                                      | Exemplo                     |
|----------------------|------------------------------------------------|-----------------------------|
| `pwd`                | Mostra o caminho completo do diretório atual   | `pwd`                       |
| `ls`                 | Lista arquivos e pastas                        | `ls -la`                    |
| `ls -la`             | Lista com detalhes (ocultos, permissões, etc)  | `ls -la /home`              |
| `cd`                 | Muda de diretório                              | `cd /var/log`               |
| `cd ..`              | Volta um diretório                             | `cd ..`                     |
| `cd ~`               | Vai para o diretório home do usuário           | `cd ~`                      |
| `cd -`               | Volta para o diretório anterior                | `cd -`                      |
| `tree`               | Mostra estrutura em árvore (instalar se não tiver) | `tree -L 2`             |

---

## 📁 Manipulação de Arquivos e Diretórios

| Comando                    | Descrição                                      | Exemplo                              |
|----------------------------|------------------------------------------------|--------------------------------------|
| `mkdir`                    | Cria diretório                                 | `mkdir projetos`                     |
| `mkdir -p`                 | Cria diretórios aninhados                      | `mkdir -p projetos/2026/julho`       |
| `touch`                    | Cria arquivo vazio ou atualiza data            | `touch arquivo.txt`                  |
| `cp`                       | Copia arquivos                                 | `cp arquivo.txt backup/`             |
| `cp -r`                    | Copia diretórios (recursivo)                   | `cp -r pasta/ backup/`               |
| `mv`                       | Move ou renomeia                               | `mv antigo.txt novo.txt`             |
| `rm`                       | Remove arquivos                                | `rm arquivo.txt`                     |
| `rm -r`                    | Remove diretórios (vazio)                      | `rm -r pasta/`                       |
| `rm -rf`                   | Remove tudo (cuidado!)                         | `rm -rf pasta/`                      |
| `rmdir`                    | Remove diretório vazio                         | `rmdir pasta/`                       |

---

## 👀 Visualização de Arquivos

| Comando              | Descrição                                      | Exemplo                     |
|----------------------|------------------------------------------------|-----------------------------|
| `cat`                | Mostra conteúdo do arquivo                     | `cat arquivo.txt`           |
| `less`               | Visualiza com paginação (q para sair)          | `less /var/log/syslog`      |
| `head`               | Mostra as primeiras linhas                     | `head -n 20 arquivo.log`    |
| `tail`               | Mostra as últimas linhas                       | `tail -n 50 arquivo.log`    |
| `tail -f`            | Acompanha o arquivo em tempo real              | `tail -f /var/log/nginx/access.log` |
| `wc -l`              | Conta linhas de um arquivo                     | `wc -l arquivo.txt`         |

---

## 🔍 Busca e Filtros

| Comando                    | Descrição                                           | Exemplo                                      |
|----------------------------|-----------------------------------------------------|----------------------------------------------|
| `grep`                     | Busca texto dentro de arquivos                      | `grep "erro" /var/log/syslog`                |
| `grep -r`                  | Busca recursiva em pastas                           | `grep -r "TODO" .`                           |
| `grep -i`                  | Ignora maiúsculas/minúsculas                        | `grep -i "warning" log.txt`                  |
| `find`                     | Busca arquivos e diretórios                         | `find . -name "*.py"`                        |
| `find` + opções            | Busca por tipo, tamanho, data, etc.                 | `find /home -type f -size +100M`             |
| `locate`                   | Busca rápida (precisa atualizar com `updatedb`)     | `locate arquivo.txt`                         |

---

## 🔐 Permissões e Proprietários

| Comando              | Descrição                                      | Exemplo                          |
|----------------------|------------------------------------------------|----------------------------------|
| `ls -l`              | Mostra permissões                              | `ls -l`                          |
| `chmod`              | Altera permissões                              | `chmod 755 script.sh`            |
| `chmod +x`           | Torna executável                               | `chmod +x programa`              |
| `chown`              | Altera dono do arquivo                         | `chown usuario:grupo arquivo`    |
| `chown -R`           | Altera dono recursivamente                     | `chown -R www-data:www-data /var/www` |

**Permissões comuns:**
- `755` → rwxr-xr-x (executável por todos)
- `644` → rw-r--r-- (leitura para todos)
- `700` → rwx------ (só o dono)

---

## ⚙️ Processos e Sistema

| Comando              | Descrição                                      | Exemplo                     |
|----------------------|------------------------------------------------|-----------------------------|
| `ps aux`             | Lista todos os processos                       | `ps aux \| grep nginx`      |
| `top`                | Monitor de processos (interativo)              | `top`                       |
| `htop`               | Versão mais bonita do top (instalar)           | `htop`                      |
| `kill`               | Mata processo pelo PID                         | `kill 1234`                 |
| `kill -9`            | Mata processo de forma forçada                 | `kill -9 1234`              |
| `killall`            | Mata pelo nome                                 | `killall firefox`           |
| `free -h`            | Mostra uso de memória                          | `free -h`                   |
| `uptime`             | Tempo ligado + carga do sistema                | `uptime`                    |

---

## 🌐 Rede e Internet

| Comando                  | Descrição                                      | Exemplo                              |
|--------------------------|------------------------------------------------|--------------------------------------|
| `ping`                   | Testa conexão com outro host                   | `ping google.com`                    |
| `curl`                   | Faz requisições HTTP                           | `curl -I https://meusite.com`        |
| `wget`                   | Baixa arquivos da internet                     | `wget https://exemplo.com/arquivo.zip` |
| `ip addr`                | Mostra interfaces de rede                      | `ip addr show`                       |
| `ss -tuln`               | Mostra portas abertas                          | `ss -tuln`                           |
| `netstat -tuln`          | Alternativa ao ss                              | `netstat -tuln`                      |
| `traceroute`             | Mostra caminho até um host                     | `traceroute google.com`              |

---

## 💾 Disco e Armazenamento

| Comando              | Descrição                                      | Exemplo                     |
|----------------------|------------------------------------------------|-----------------------------|
| `df -h`              | Mostra espaço em disco (human readable)        | `df -h`                     |
| `du -sh`             | Tamanho de pastas/arquivos                     | `du -sh /var/log`           |
| `du -sh *`           | Tamanho de todos os itens do diretório atual   | `du -sh *`                  |
| `ncdu`               | Análise interativa de disco (instalar)         | `ncdu`                      |

---

## 📦 Compactação e Arquivos

| Comando                    | Descrição                                      | Exemplo                              |
|----------------------------|------------------------------------------------|--------------------------------------|
| `tar -czvf`                | Cria arquivo .tar.gz                           | `tar -czvf backup.tar.gz /home/user` |
| `tar -xzvf`                | Extrai .tar.gz                                 | `tar -xzvf backup.tar.gz`            |
| `zip`                      | Cria arquivo .zip                              | `zip -r backup.zip pasta/`           |
| `unzip`                    | Extrai .zip                                    | `unzip backup.zip`                   |
| `gzip`                     | Comprime arquivo (cria .gz)                    | `gzip arquivo.txt`                   |
| `gunzip`                   | Descomprime .gz                                | `gunzip arquivo.txt.gz`              |

---

## ⌨️ Atalhos Úteis do Terminal

| Atalho               | Função                                         |
|----------------------|------------------------------------------------|
| `Ctrl + C`           | Cancela comando em execução                    |
| `Ctrl + Z`           | Pausa processo (pode retomar com `fg`)         |
| `Ctrl + D`           | Sai do terminal / EOF                          |
| `Ctrl + L`           | Limpa a tela (mesmo que `clear`)               |
| `Ctrl + R`           | Busca reversa no histórico de comandos         |
| `Ctrl + A`           | Vai para o início da linha                     |
| `Ctrl + E`           | Vai para o final da linha                      |
| `Ctrl + U`           | Apaga tudo antes do cursor                     |
| `Ctrl + K`           | Apaga tudo depois do cursor                    |
| `Tab`                | Autocompleta comandos, arquivos e pastas       |
| `↑` / `↓`            | Navega pelo histórico de comandos              |
| `!!`                 | Repete o último comando                        |
| `sudo !!`            | Repete o último comando com sudo               |

---

## 🔀 Redirecionamento e Pipes

| Comando              | Descrição                                      | Exemplo                                      |
|----------------------|------------------------------------------------|----------------------------------------------|
| `>`                  | Redireciona saída para arquivo (sobrescreve)   | `ls > lista.txt`                             |
| `>>`                 | Adiciona saída ao final do arquivo             | `echo "nova linha" >> arquivo.txt`           |
| `2>`                 | Redireciona erros                              | `comando 2> erros.log`                       |
| `\|` (pipe)          | Envia saída de um comando para outro           | `ps aux \| grep nginx`                       |
| `\| less`            | Visualiza saída longa com paginação            | `cat arquivo.log \| less`                    |
| `\| grep`            | Filtra saída                                   | `dmesg \| grep error`                        |
| `\| wc -l`           | Conta linhas da saída                          | `ls \| wc -l`                                |

---

## 💡 Dicas de Ouro

- Use `man comando` para ver o manual completo de qualquer comando
- Use `comando --help` para ver opções rápidas
- Pressione `Tab` duas vezes para ver sugestões
- Use `history` para ver todos os comandos executados
- Crie aliases no `~/.bashrc` para comandos longos que você usa muito
- Use `sudo -i` para virar root temporariamente (cuidado!)
- Sempre leia o que vai apagar com `rm -rf` antes de executar

---

## 📁 Arquivo

Este cheat sheet foi gerado em:

**`/home/workdir/artifacts/terminal-linux-cheatsheet.md`**

---

Feito para facilitar o dia a dia no terminal Linux! 🐧

Se quiser que eu adicione mais comandos, crie seções específicas (ex: Docker, Git, systemd) ou gere uma versão em PDF, é só pedir!