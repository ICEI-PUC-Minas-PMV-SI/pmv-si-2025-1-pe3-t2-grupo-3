# Configuração das Variáveis de Ambiente

Para que a aplicação funcione corretamente, é necessário configurar as variáveis de ambiente. Estas variáveis contêm chaves de API e outras informações sensíveis que não devem ser enviadas diretamente para o repositório do GitHub.


## Adicionar a Chave da API do TMDB

Dentro do ficheiro `.env`, precisa de adicionar a sua chave de API do The Movie Database (TMDB). Se não tiver uma, pode criar uma conta gratuitamente no [site do TMDB](https://www.themoviedb.org/signup) e solicitar uma chave de API.

Adicione a seguinte linha ao seu ficheiro `.env`, substituindo `SUA_CHAVE_API_AQUI` pela chave que obteve:

TMDB_API_KEY=SUA_CHAVE_API_AQUI

## Utilizar a Chave Padrão do Projeto

Caso não queira criar a sua própria chave de API apenas para testar o projeto, pode utilizar a chave que já foi disponibilizada. Copie e cole a linha abaixo no seu ficheiro `.env`:

TMDB_API_KEY=ba22b4d35d5c174b765b9b607c07166c
