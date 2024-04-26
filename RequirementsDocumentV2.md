# Requirements Document - future EZElectronics

Date:

Version: V1 - description of EZElectronics in FUTURE form (as proposed by the team)

| Version number | Change |
| :------------: | :----: |
|       1        |        |

# Contents

- [Requirements Document - future EZElectronics](#requirements-document---future-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1](#use-case-1-uc1)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
      - [Scenario 1.x](#scenario-1x)
    - [Use case 2, UC2](#use-case-2-uc2)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name |                Description                |
| :--------------: | :---------------------------------------: |
|      Admin       |        User with higher privilege         |
|     Manager      | User who can modify the product catalogue |
|     Customer     | User who can buy from EZEletronics store  |
|    SW factory    |    Developer of EZElectronics website     |
| Payment service  |  Service that manage the payment process  |
| Shipping service | Service that manage the shipping process  |

# Context Diagram and interfaces

## Context Diagram

![Alt text](./images/ContextDiagramV2.png)

## Interfaces

|      Actor       |                          Logical Interface                          | Physical Interface |
| :--------------: | :-----------------------------------------------------------------: | :----------------: |
|      Admin       | GUI (custom dashbord to add/delete user accounts with manager role) |         PC         |
|     Manager      |                 GUI (product catalogue management)                  |         PC         |
|     Customer     |              GUI (purchasing products from catalogue)               |         PC         |
| Payment service  |                          www.paypal.com/it                          |      Internet      |
| Shipping service |                             www.gls.it                              |      Internet      |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>
\<Persona is-an-instance-of actor>
\<stories will be formalized later as scenarios in use cases>

# Functional and non functional requirements

## Functional Requirements

|  ID   |                           Description                           |
| :---: | :-------------------------------------------------------------: |
|  FR1  |               Users management and authentication               |
| FR1.1 |                              Login                              |
| FR1.2 |                             Logout                              |
| FR1.3 |                             Signup                              |
| FR1.4 |  Account management (creation, edit, delete, role definition)   |
|  FR2  |                       Product management                        |
| FR2.1 |                   Add/remove a single product                   |
| FR2.2 |       Registers the arrival of a new (set of) product(s)        |
| FR2.3 |                     Marks a product as sold                     |
| FR2.4 |                      Returns all products.                      |
| FR2.5 | Returns all products of a specific category/of a specific model |
| FR2.6 |                  Returns a product by its code                  |
|  FR3  |                         Cart management                         |
| FR3.1 |            Add/remove product given its ID from cart            |
| FR3.2 |                   Checks out the user's cart                    |
| FR3.3 |        View purchased carts history for a specific user         |
| FR3.4 |               Delete a specific cart given its ID               |
| FR3.5 |                       View cart products                        |
|  FR4  |            Manager accounts management (admin only)             |
| FR4.1 |           Add/delete user accounts with manager role            |
|  FR5  |                         Payment service                         |
| FR5.1 |                    Handling payment requests                    |
| FR5.2 |                      Handling payment data                      |
|  FR6  |                        Shipping service                         |
| FR6.1 |                   Handling shipping requests                    |
| FR6.2 |                     Handling shipping data                      |

## Non Functional Requirements

|  ID  | Type (efficiency, reliability, ...) |                                                Description                                                | Refers to |
| :--: | :---------------------------------: | :-------------------------------------------------------------------------------------------------------: | :-------: |
| NFR1 |              Usability              |                                       Users must not need training                                        |   FR1-4   |
| NFR2 |             Efficiency              |                               All app features must be completed under 0.1s                               |   FR1-4   |
| NFR3 |             Reliability             |                             Users must not report more than one bug per year                              |   FR1-4   |
| NFR4 |             Portability             | Web app must be compatible for the following browsers: Chrome v64.0.3282, Firefox v57.0.4, Safari v12.0.1 |   FR1-4   |
| NFR5 |           Payments safety           |     All the payment process steps must be fully completed before any money is taken from the customer     |    FR5    |
| NFR6 |           Shipping safety           |                All sent products must arrive within 3-5 working days in perfect conditions                |    FR6    |

# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>
\<next describe here each use case in the UCD>

### Use case 1, UC1

| Actors Involved  |                                                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition  |  \<Boolean expression, must evaluate to true after UC is finished>   |
| Nominal Scenario |         \<Textual description of actions executed by the UC>         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                        \<exceptions, errors >                        |

##### Scenario 1.1

\<describe here scenarios instances of UC1>
\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>
\<a scenario is a more formal description of a story>
\<only relevant scenarios should be described>

|  Scenario 1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | \<Boolean expression, must evaluate to true before the scenario can start> |
| Post condition |  \<Boolean expression, must evaluate to true after scenario is finished>   |
|     Step#      |                                Description                                 |
|       1        |                                                                            |
|       2        |                                                                            |
|      ...       |                                                                            |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2

..

### Use case x, UCx

..

# Glossary

![Alt text](./images/ClassDiagramV2.png)

# System Design

\<describe here system design>
\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram>
