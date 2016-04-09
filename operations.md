**CRUD operations**

GET = get list or item
POST = create item
PUT = update item
DELETE

Url                                                         Verbs               Optional filters
------------------------------------------------------------------------------------------------------------------------

/api/organizers                                             GET, POST           -
/api/organizers/:id                                         GET, PUT, DELETE    -

/api/players                                                GET                 -
/api/organizers/:id/players                                 GET, POST           -
/api/organizers/:id/players/:name                           GET, PUT, DELETE    -

/api/tournaments                                            GET                 -
/api/organizers/:id/tournaments                             GET, POST           -
/api/organizers/:id/tournaments/:name                       GET, PUT, DELETE    -

/api/organizers/:id/tournaments/:name/prepare               PUT                 -
/api/organizers/:id/tournaments/:name/start                 PUT                 -
/api/organizers/:id/tournaments/:name/finish                PUT                 -
/api/organizers/:id/tournaments/:name/archive               PUT                 -

/api/organizers/:id/tournaments/:name/participants          GET, POST           -
/api/organizers/:id/tournaments/:name/standings/:name       DELETE              -

/api/organizers/:id/tournaments/:name/matches               GET, POST           -
/api/organizers/:id/tournaments/:name/matches/:num          PUT, DELETE         -
