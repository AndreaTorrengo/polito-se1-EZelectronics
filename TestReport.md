# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

![Alt text](./images/dependencygraph.png)

# Integration approach

Gli Unit test sono stati fatti in base alle API. Abbiamo 4 componenti (products, user, cart e review) con i corrispettivi DAO, Controller e Route.

Per ciascuna delle componenti sono stati realizzati test che verificano la validità di ciascun pezzo di codice del singolo componente implementato.

Ciascun unit test è stato fatto partendo dal DAO proseguendo con il controller e finendo con le route (stesso approccio con il quale il codice è stato realizzato), facendo il mock di ogni singolo componente esterno chiamato.

Una volta passati gli unit test, si è proseguito alla realizzazione degli integration test dove si è chiamato le API delle route, verificando tutti i casi richiesti.

# Tests

## Route products

|       Test case name        |                                  Object(s) tested                                   | Test level | Technique used |
| :-------------------------: | :---------------------------------------------------------------------------------: | :--------: | :------------: |
|       POST /products        |                             route inserimento products                              |    Unit    |    WhiteBox    |
|   PATCH /products/:model    |                route per aumentare la quantità di un set di prodotti                |    Unit    |    WhiteBox    |
| PATCH /products/:model/sell |               route per vendere una determinata quantit' di prodotti                |    Unit    |    WhiteBox    |
|        GET /products        |       route per ottenere i prodotti nel db con filtro per categoria e modello       |    Unit    |    WhiteBox    |
|   GET /products/available   | route per ottenere i prodotti disponibili del db con filtro per categoria e modello |    Unit    |    WhiteBox    |
|   DELETE /products/:model   |                       route per cancellare un prodotto dal db                       |    Unit    |    WhiteBox    |
|      DELETE /products       |                    route per cancellare tutti i prodotti dal db                     |    Unit    |    WhiteBox    |

## Route reviews

|       Test case name       |                                      Object(s) tested                                       | Test level | Technique used |
| :------------------------: | :-----------------------------------------------------------------------------------------: | :--------: | :------------: |
|    POST /reviews/:model    |            route per aggiungere una review a un prodotto acquistato da un utente            |    Unit    |    WhiteBox    |
|    GET /reviews/:model     |                route per ottenere tutte le review di uno specifico prodotto                 |    Unit    |    WhiteBox    |
|   DELETE /reviews/:model   | route per cancellare una singola review fatta su uno specifico prodotto dall'utente loggato |    Unit    |    WhiteBox    |
| DELETE /reviews/:model/all |            route per cancellare tutte le review fatta su uno specifico prodotto             |    Unit    |    WhiteBox    |
|      DELETE /reviews       |               route per cancellare tutte le review fatta su tutti i prodotti                |    Unit    |    WhiteBox    |

## Route users

|     Test case name      |                       Object(s) tested                        | Test level | Technique used |
| :---------------------: | :-----------------------------------------------------------: | :--------: | :------------: |
|       POST /users       |                  route per creare un utente                   |    Unit    |    WhiteBox    |
|       GET /users        |              route per ottenere tutti gli utenti              |    Unit    |    WhiteBox    |
|    GET /users/roles     |  route per ottenere tutti gli utenti di uno specifico ruolo   |    Unit    |    WhiteBox    |
|  GET /users/:username   | route per ottenere un singolo user con uno specifico username |    Unit    |    WhiteBox    |
| DELETE /users/:username |           route per eliminare uno specifico utente            |    Unit    |    WhiteBox    |
|      DELETE /users      |             route per eliminare tutti gli utenti              |    Unit    |    WhiteBox    |
| PATCH /users/:username  |           route per aggiornare i dati di un utente            |    Unit    |    WhiteBox    |
|                         |                                                               |    Unit    |    WhiteBox    |
|                         |                                                               |    Unit    |    WhiteBox    |
|                         |                                                               |    Unit    |    WhiteBox    |

## Route carts

|        Test case name         |                                Object(s) tested                                | Test level | Technique used |
| :---------------------------: | :----------------------------------------------------------------------------: | :--------: | :------------: |
|          POST /carts          |           route per aggiungere un'istanza di un prodotto al carrello           |    Unit    |    WhiteBox    |
|          GET /carts           |         route per ottenere il carrello non pagato dell'utente loggato          |    Unit    |    WhiteBox    |
|      GET /carts/history       |     route per ottenere lo storico dei carrelli pagati dell'utente loggato      |    Unit    |    Whitebox    |
|        GET /carts/all         |            route per ottenere tutti i carrelli di tutti gli utenti             |    Unit    |    Whitebox    |
|         PATCH /carts          |        route per simulare il pagamento del carrello dell'utente loggato        |    Unit    |    Whitebox    |
|         DELETE /carts         |                     route per cancellare tutti i carrelli                      |    Unit    |    Whitebox    |
|     DELETE /carts/current     |                    route per svuotare il carrello corrente                     |    Unit    |    Whitebox    |
| DELETE /carts/products/:model | route per rimuovere un'istanza di un prodotto dal carrello dell'utente loggato |    Unit    |    Whitebox    |

## Controller products

|         Test case name          |                                                              Object(s) tested                                                              | Test level | Technique used |
| :-----------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :--------: | :------------: |
|     Registrazione prodotto      |          Test che registra un prodotto e verifica se il prodotto esiste già, lo aggiunge se non esiste, controlla errori di data           |    Unit    |    WhiteBox    |
|         Cambio quantità         |                           Test che cambia la quantità di prodotto con controllo prodotto inesistente/errori data                           |    Unit    |    WhiteBox    |
|        Vendita prodotto         | Test che vende il prodotto con controllo che il prodotto esiste, se è disponibile nella quantità richiesta ed errori sulle date di aquisto |    Unit    |    WhiteBox    |
|        Cancella prodotto        |                                     Test che cancella un prodotto con verifica che il prodotto esista                                      |    Unit    |    WhiteBox    |
|    Cancella tutti i prodotti    |                                         Test che cancella tutti i prodotti con verifica di errori                                          |    Unit    |    WhiteBox    |
|       Visualizza prodotti       |                    Test che restituisce prodotti in base alla categoria o al modello e verifica che il prodotto esista                     |    Unit    |    WhiteBox    |
| Visualizza prodotti disponibili |                    Test che restituisce i prodotti disponibili in base al modello o alla categoria con controllo errori                    |    Unit    |    WhiteBox    |

## Controller carts

|                    Test case name                    |                                                                                         Object(s) tested                                                                                          | Test level | Technique used |
| :--------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------: | :------------: |
|         Aggiunta nuovo prodotto al carrello          |                                                 Test che verifica che il prodotto da aggiungere sia valido e disponibile (quantità in stock > 0)                                                  |    Unit    |    WhiteBox    |
| Visualizzazione carrello corrente e carrelli passati |                                Test che verifica la visualizzazione del carrello corrente (eventualmente vuoto) e dei carrelli passati (eventualmente inesistenti)                                |    Unit    |    WhiteBox    |
|           Rimozione prodotto dal carrello            |                                                       Test che verifica che il prodotto da rimuovere sia valido e all'interno del carrello                                                        |    Unit    |    WhiteBox    |
|                 Svuotamento carrello                 |                                                                             Test che verifica che il carrello esiste                                                                              |    Unit    |    WhiteBox    |
|    Cancellazione dei carrelli di tutti gli utenti    |                                                                          Test per verificare la funzionalità specificata                                                                          |    Unit    |    WhiteBox    |
|                  Checkout carrello                   | Test che verifica l'esistenza del carrello, che non deve essere vuoto. Se almeno una quantità richiesta di un prodotto nel carrello supera la quantità disponibile in stock, il checkout fallisce |    Unit    |    WhiteBox    |

## Controller reviews

|            Test case name             |                                       Object(s) tested                                        | Test level | Technique used |
| :-----------------------------------: | :-------------------------------------------------------------------------------------------: | :--------: | :------------: |
|            Aggiunta review            |          Test che aggiunge una review con verifica che non esista già ed errore DAO           |    Unit    |    WhiteBox    |
|  Visualizzazione prodotti con review  |             Test che restituisce i prodotti con review e verifica errori nel DAO              |    Unit    |    WhiteBox    |
|     Cancellazione review prodotto     | Test che cancella le review di un prodotto verificando errori del dao e di review inesistente |    Unit    |    WhiteBox    |
| Cancellazione review tutti i prodotti |                        Test che cancella le review di tutti i prodotti                        |    Unit    |    WhiteBox    |

## Controller users

|            Test case name            |                                 Object(s) tested                                  | Test level | Technique used |
| :----------------------------------: | :-------------------------------------------------------------------------------: | :--------: | :------------: |
|           Creazione utente           |                              Test che crea un utente                              |    Unit    |    WhiteBox    |
|        Visualizzazione Utenti        |                            Test che restituisce utente                            |    Unit    |    WhiteBox    |
|     Visualizzazione Utenti Ruolo     |  Test che restituisce gli utenti di un ruolo specifico e verifica errore del DAO  |    Unit    |    WhiteBox    |
| Visualizzazione utenti dato username |    Test che restituisce un utente dato il suo username, verifa errore del DAO     |    Unit    |    WhiteBox    |
|           Verifa username            |                 Test che verifica se l'username è già in uso o no                 |    Unit    |    WhiteBox    |
|         Cancellazione utente         |          Test che cancella un user utente, verificando un errore nel dao          |    Unit    |    WhiteBox    |
|      Cancellazione tutti utenti      | Test che cancella tutti gli utenti, verifica errore del dao e che ci siano utenti |    Unit    |    WhiteBox    |
|         Modifica dati utente         |                       Test che modifica i dati di un utente                       |    Unit    |    WhiteBox    |

## DAO products

|      Test case name      |                                                                       Object(s) tested                                                                       | Test level | Technique used |
| :----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------: | :------------: |
|   Inserimento prodotti   |                                  Test che registra prodotti, verifica che non esista già e che non abbia parametri invalidi                                  |    Unit    |    WhiteBox    |
|  Cancellazione prodotti  | Test che cancella tutti i prodotti o un singolo prodotto specifico, verifica se il prodotto da cancellare esiste e se la cancellazione avviene correttamente |    Unit    |    WhiteBox    |
|  Aggiornamento prodotti  |                                              Test che aggiorna un prodotto e ne verifica la corretta esecuzione                                              |    Unit    |    WhiteBox    |
| Visualizzazione prodotti |          Test che visualizza un prodotto dato il modello, tutti i prodotti, verifica errori e se ci sono prodotti e se il modello richiesto esiste           |    Unit    |    WhiteBox    |

## DAO carts

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |
|                |                  |    Unit    |    WhiteBox    |

## DAO reviews

|               Test case name               |                                                                  Object(s) tested                                                                  | Test level | Technique used |
| :----------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------: | :--------: | :------------: |
|      Visualizzazione review prodotto       |                        Test che restituisce tutte le review di un prodotto dato il suo modello e verifica eventuali errori                         |    Unit    |    WhiteBox    |
|       Aggiungere review al prodotto        | Test che aggiunge una review a un prodotto, verifica l'aggiunta corretta, che il prodotto sia presente tra quelli del cart acquistati e che esista |    Unit    |    WhiteBox    |
| Cancellazione Review dato utente e modello |      Test che cancella la review di un dato utente su uno specifico prodotto, verifica che sia cancellata, fallimenti e che la review esista       |    Unit    |    WhiteBox    |
| Cancellazione review dato modello prodotto |                Test che cancella le review di un dato prodotto, verifica che siano cancellate, altri errori, che il prodotto esista                |    Unit    |    WhiteBox    |
|         Cancellazione tutte review         |                                     Test che cancella le review di tutti i prodotti, verifica errori generici                                      |    Unit    |    WhiteBox    |

## DAO users

|           Test case name           |                                                               Object(s) tested                                                               | Test level | Technique used |
| :--------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: | :--------: | :------------: |
| Visualizzazione utenti autenticati | Test che restituisce se un utente è autenticato, che la password sia valida, che non ci sia un utente con lo stesso username o errori nel db |    Unit    |    WhiteBox    |
|          Creazione utenti          |                           Test che crea un utente, verifica che l'utente non esista e che non ci sia errori nel db                           |    Unit    |    WhiteBox    |
|  Visualizza utenti dato username   |               Test che visualizza utenti dato un username, verifica che l'username fornito esista e non ci siano errori nel db               |    Unit    |    WhiteBox    |
|       Visualizzazione utenti       |                                    Test che restituisce gli user, verifica che ci siano ed errori nel db                                     |    Unit    |    WhiteBox    |
|          Cancella utente           |                         Test che cancella un utente specifico, verifica che esiste e che non ci siano errori nel db                          |    Unit    |    WhiteBox    |
|     Cancella tutti gli utenti      |                         Test che cancella tutti gli utenti, verifica che ci siano user e non ci siano errori nel db                          |    Unit    |    WhiteBox    |
|     Aggiornamento dati utenti      |                     Test che aggiorna i dati di un utente, verifica che esista l'utente e che non ci siano errori nel db                     |    Unit    |    WhiteBox    |
|                                    |                                                                                                                                              |    Unit    |    WhiteBox    |
|                                    |                                                                                                                                              |    Unit    |    WhiteBox    |
|                                    |                                                                                                                                              |    Unit    |    WhiteBox    |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage

The following coverage stats has been generated by this npm command:
> npm test -- --coverage

![Alt text](./images/testReportJestCoverageScreen.png)