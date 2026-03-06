# Kasvikatalogi

Full-stack verkkosovellus, jossa vinkkejä kasveilla värjäämiseen.

Palvelinpuoli on rakennettu Node.js:llä ja Expressillä. Kasvidata tallennetaan JSON-tiedostoon. Sivusto on responsiivinen.

Vain admin voi muokata kasvilistaa. Adminille on toteutettu suojattu kirjautuminen, jonka kautta voi lisätä ja poistaa kasveja suoraan selaimen kautta.


## Käynnistys

Tätä projektia ei voi avata suoraan selaimessa tai Live Serverillä.

1. Käynnistä palvelin terminaalissa:
node server.js

2. Avaa selaimessa:
http://localhost:3000