# Project Estimation - FUTURE

Date: 2024-05-03

Version: 1.0

# Estimation approach

Consider the EZElectronics project in FUTURE version (as proposed by your team in requirements V2), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch (not from V1)

# Estimate by size

###

|                                                                                                         | Estimate  |
| ------------------------------------------------------------------------------------------------------- | --------- |
| NC = Estimated number of classes to be developed                                                        | 15        |
| A = Estimated average size per class, in LOC                                                            | 380 LOC   |
| B = Estimated size of frontend, in LOC                                                                  | 4000 LOC  |
| D = Estimated size of requirement document, in LOC                                                      | 831 LOC   |
| F = Estimated size of API document, in LOC                                                              | 387 LOC   |
| G = Estimated size of tests, in LOC                                                                     | 1200 LOC  |
| S = Estimated size of project, in LOC (= NC \* A)                                                       | 12118 LOC |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)                    | 1211.8 PH |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                                     | 36354 €   |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 7.6 weeks |

# Estimate by product decomposition

###

| component name       | Estimated effort (person hours) |
| -------------------- | ------------------------------- |
| requirement document | 60                              |
| GUI prototype        | 20                              |
| design document      | 24                              |
| code                 | 480                             |
| unit tests           | 80                              |
| api tests            | 50                              |
| management documents | 26                              |

# Estimate by activity decomposition

###

| Activity name                               | Estimated effort (person hours) |
| ------------------------------------------- | ------------------------------- |
| Review existing code                        | 8                               |
| Defining requirements                       | 60                              |
| Model GUI                                   | 20                              |
| Estimation                                  | 16                              |
| Design                                      | 48                              |
| Test data                                   | 14                              |
| Prepare software requirements specification | 40                              |
| Software requirements review                | 20                              |
| API documentation                           | 24                              |
| Coding                                      | 480                             |
| Test plan                                   | 40                              |
| Software testing                            | 240                             |

###

![Alt text](./images/ActivitiesGanttV2.png)

# Summary

Report here the results of the three estimation approaches. The estimates may differ. Discuss here the possible reasons for the difference

|                                    | Estimated effort | Estimated duration  |
| ---------------------------------- | ---------------- | ------------------- |
| estimate by size                   | 1211.8 PH        | 303 h (~12d)        |
| estimate by product decomposition  | 740 PH           | 185 h               |
| estimate by activity decomposition | 910 PH           | 227.5 h (~9d + 12h) |
