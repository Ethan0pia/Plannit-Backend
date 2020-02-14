Events API V1
-----------------------------------------------------------------------------

get /api/v1/events
	Returns an array of events sorted by closest date to present. Always returns code 200.
	
	Example output:
	[
		{
			"name":"Cards",
			"date":"Sun Dec 17 2018 03:24:00 GMT-0500 (EST)",
			"description":"A fun game of cards.",
			"blurb":"A short description up to 100 characters.",
			"category":"cards",
			"organizer_name":"Ethan0pia",
			"location":"TCS cafeteria",
			"private":false,
			"items":[
					{"listName":"Food","listContents":["pizza","turkey","subs"]},
					{"listName":"Games","listContents":["poker","war","pitch"]},
					...
				],
			"food": true
		},
		{
			"name":"Monopoly",
			"date":"Sun Dec 17 2018 03:24:00 GMT-0500 (EST)",
			"description":"A fun game of monopoly.",
			"blurb":"A short description up to 100 characters.",
			"category":"board game",
			"organizer_name":"Ausd2",
			"location":"TCS cafeteria",
			"private":false,
			"items":[
					{"listName":"Games","listContents":["monopoly","battleship","checkers"]}
				],
			"food": false
		}
		...
	]

get /api/v1/events/short/{start}/{limit}
	Returns an array of events sorted by closest date to preset and cuts the description down to 100 characters.. {start} is the index to start at. {limit} is the maximum number of events to return. Returns 200 if it worked. Returns 400 if start or limit is not a valid number.
		
	Example output for "/api/v1/short/0/2":
	[
		{
			"name":"Cards",
			"date":"Sun Dec 17 2018 03:24:00 GMT-0500 (EST)",
			"description":"A fun game of cards.",
			"blurb":"A short description up to 100 characters.",
			"category":"cards",
			"organizer_name":"Ethan0pia",
			"location":"TCS cafeteria",
			"private":false,
			"items":[
					{"listName":"Food","listContents":["pizza","turkey","subs"]},
					{"listName":"Games","listContents":["poker","war","pitch"]},
					...
				],
			"food": true
		},
		{
			"name":"Monopoly",
			"date":"Sun Dec 17 2018 03:24:00 GMT-0500 (EST)",
			"description":"A fun game of monopoly.",
			"blurb":"Short description",
			"blurb":"A short description up to 100 characters.",
			"category":"board game",
			"organizer_name":"Ausd2",
			"location":"TCS cafeteria",
			"private":false,
			"items":[
					{"listName":"Games","listContents":["monopoly","battleship","checkers"]}
				],
			"food": false
		}
	]

get /api/v1/events/event/{event id}
	Returns the full information for the event with that ID. Returns 404 if the event with that id is not found. Returns 200 if successful.
	
	Example output for "/api/v1/event/13223":
	{
		"name":"Cards",
		"date":"Sun Dec 17 1995 03:24:00 GMT-0500 (EST)",
		"description":"A fun game of cards.",
		"blurb":"A short description up to 100 characters.",
		"category":"cards",
		"organizer_name":"Ethan0pia",
		"location":"TCS cafeteria",
		"private":false,
		"items":[
				{"listName":"Food","listContents":["pizza","turkey","subs"]},
				{"listName":"Games","listContents":["poker","war","pitch"]},
				...
			],
		"food": true
	}

post /api/v1/events
	Returns 201 if successfully created. Requires a name, date (JavaScript date format), location, description, category, organizer's id, and organizer's username. Optional categories include lists of items, and a boolean if food will be there, and a boolean if the event is private. Food boolean and private boolean defaults to false if not included in the request. Returns 400 if all the required fields are not send. Returns 401 if the user is not logged in. Returns the created item.
	
	Example input:
	{
		"name": "second",
		"date": "2025-12-17T08:24:00.000Z",
		"description": "A fun game of cards.",
		"blurb": "Something",
		"category": "cards",
		"location": "TCS cafeteria",
		"private": false,
		"items": [
			{
				"items": [],
				"listName": "Food",
				"listContents": [
					"pizza",
					"turkey",
					"subs"
				]
			},
			{
				"items": [],
				"listName": "Games",
				"listContents": [
					"poker",
					"war",
					"pitch"
				]
			}
		],
		"food": true,
		"organizer_id": "123123",
		"organizer_username": "User's Name"
	}

	Example output:
	{
		"id":"123asfd12d45",
		"name":"Cards",
		"date":"Sun Dec 17 1995 03:24:00 GMT-0500 (EST)",
		"blurb":"Short description",
		"description":"A fun game of cards.",
		"blurb":"A short description up to 100 characters.",
		"category":"cards",
		"organizer_name":"Ethan0pia",
		"location":"TCS cafeteria",
		"private":false,
		"items":[
				{"listName":"Food","listContents":["pizza","turkey","subs"]},
				{"listName":"Games","listContents":["poker","war","pitch"]},
				...
			],
		"food": true,
		"organizer_id": "123123",
		"organizer_username": "User's Name"
	}

put /api/v1/events/
	Returns 202 if successfully edited. Requires the event id, the event name, date (JavaScript date format), location, description, category, organizer's id, and organizer's username. Optional categories include lists of items, a boolean if food will be there, a boolean if the event is private, and a short blurb description string. Food boolean and private boolean defaults to false if not included in the request, blurb defaults to empty string. Returns 400 if all the required fields are not send or that id is bad. Returns 401 if the user is not logged in or does not have access to the event. Returns 404 if the event with that id is not found. Returns the updated item.
	
	Example input:
	{
		"_id":"123asfd12d45",
		"name": "second",
		"date": "2025-12-17T08:24:00.000Z",
		"description": "A fun game of cards.",
		"blurb": "Something",
		"category": "cards",
		"location": "TCS cafeteria",
		"private": false,
		"items": [
			{
				"items": [],
				"listName": "Food",
				"listContents": [
					"pizza",
					"turkey",
					"subs"
				]
			},
			{
				"items": [],
				"listName": "Games",
				"listContents": [
					"poker",
					"war",
					"pitch"
				]
			}
		],
		"food": true,
		"organizer_id": "123123",
		"organizer_username": "User's Name"
	}
	
	Example output:
	{
		"_id":"123asfd12d45",
		"name": "second",
		"date": "2025-12-17T08:24:00.000Z",
		"description": "A fun game of cards.",
		"blurb": "Something",
		"category": "cards",
		"location": "TCS cafeteria",
		"private": false,
		"items": [
			{
				"items": [],
				"listName": "Food",
				"listContents": [
					"pizza",
					"turkey",
					"subs"
				]
			},
			{
				"items": [],
				"listName": "Games",
				"listContents": [
					"poker",
					"war",
					"pitch"
				]
			}
		],
		"food": true,
		"organizer_id": "123123",
		"organizer_username": "User's Name"
	}
	

delete /api/v1/events/{event id}
	Returns 410 Gone if successfully deleted. Returns 401 if the user is not logged in or authorized to delete the event. Returns 404 if the event with that id is not found to delete. Gets user id from token. Send it a json with an organizer_id and role.

	Example Input:
	{
		organizer_id: "123123",
		role: 0
	}
	
	Example output:
	Gone
	


