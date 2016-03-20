**CRUD operations**

GET = get list or item
POST = create item
PUT = update item
DELETE

Url                                             Verbs               Optional filters
------------------------------------------------------------------------------------------------------------------------
/api/v1/organizers                              GET, POST
/api/v1/organizers/:name                        GET, DELETE, PUT
/api/v1/organizers/:name/tournaments            GET
/api/v1/tournaments                             GET, POST           organizer
/api/v1/tournaments/:name                       GET, DELETE, PUT    participants (bool), standings (bool),
                                                                    matches (bool)
/api/v1/tournaments/:name/populate              PUT
/api/v1/tournaments/:name/participants          GET
/api/v1/tournaments/:name/standings             GET
/api/v1/tournaments/:name/matches               GET
/api/v1/tournaments/:name/matchDays             GET                 matches (bool)
/api/v1/tournaments/:name/matchDays/:number     GET, DELETE, PUT    matches (bool)
/api/v1/players                                 GET, POST           organizer, tournament
/api/v1/players/:name                           GET, DELETE, PUT
/api/v1/players/:name/tournaments               GET
/api/v1/players/:name/matches                   GET                 tournament, completed (bool), upcoming (bool),
                                                                    archived (bool)
