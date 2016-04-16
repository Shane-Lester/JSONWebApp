// services.js
angular.module('JSONApp')
	.factory('Items', function() {
		var service = {};
		var newTitle = "";
		// service.deptAddress = "Full web address of departmental data";
		// service.clinAddress = "Full web address of clinical data";

		service.entries = {
			"department": [{
					"title": "Consultants",
					"data": [{
							"heading": "Mr White"
						}, {
							"subheading": "Otology"
						}, {
							"info1": "Secretary- Julie"
						}, {
							"info2": "Ex 1111"
						}, {
							"item": "</hr>"
						}, {
							"heading": "Mr Black"
						}, {
							"subheading": "Rhinology"
						}, {
							"info1": "Secretary- Anne"
						}, {
							"info2": "Ex 1234"
						}, {
							"item": "</hr>"
						}

					]
				}, {
					"title": "SAS Doctors",
					"data": []
				}, {
					"title": "Rota",
					"data": []
				}

			]
		};

		service.setEntries = function(data, address) {
			service.entries = data;
			// service.deptAddress = address;
		}

		service.clinicalEntries = {
			"clinical": [{
				"title": "Acute tonsillitis",
				"shortname": "tonsillitis",
				"summary": "Most commonly seen in children|adolescents but may occur in adults.",
				"symptoms": "Sore throat<br/> Odynophagia +|- dysphagia<br/> Pyrexia<br/> Referred otalgia",
				"signs": "Pyrexia<br/> Cervical lymphadenopathy<br/> Hyperaemic tonsils with pus and debris in crypts",

				"admit": "Unable to eat and drink despite maximal analgesia<br/>Airway concerns",
				"required": "Full clerking to include cardiorespiratory and abdominal examination<br/> FBC, U&E, LFT, PB<br/> IV access and IVT<br/> Regular paracetemol and ibuprofen plus regular|prn codeine phosphate<br/> IV benzylpenicillin (or clarithromycin if penicllin allergic)<br/> Single dose of dexamethasone if airway concerns|severe pain despite maximal analgesia",
				"flags": "Unilateral tonsillitis especially in adult ?underlying malignancy<br/> Severe symptoms of sore throat,odynophagia but oropharynx normal ?supraglottitis<br/> Unilateral neck swelling|torticollis ?neck space abscess"

			}, {
				"title": "Peritonsillar abscess (quinsy)",
				"summary": "Collection of pus in the peritonsillar space",
				"symptoms": "Usually starts with symptoms of tonsillitis<br/> Increasing unilateral pain.",
				"signs": "As for tonsillitis<br/> Muffled voice â€œhot potatoâ€<br/> Drooling<br/> Trismus<br/> Unilateral peritonsillar swelling with deviated uvula",
				"admit": "Admit all patients with peritonsillar abscess.",
				"required": "As for tonsillitis<br/> Incision and drainage of abscess under local anaesthetic.",
				"flags": "As for tonsillitis."
			}, {
				"title": "Post tonsillectomy pain|infection",
				"summary": "First 7 days following surgery can be extremely painful<br/> Slough in tonsil fossae is normal, does not necessarily mean infection.",
				"symptoms": "Usually present in first week following surgery<br/> Unable to eat and drink<br/> Halitosis.",
				"signs": "Sloughy tonsil beds (usual post tonsillectomy appearance)<br/> Pyrexia.",
				"admit": "Unable to eat or drink despite adequate analgesia<br/> Evidence of bleeding.",
				"required": "Full patient clerking<br/> FBC, U&E, (G&S if any bleeding)<br/> IV access and IVT<br/> Regular paracetemol, ibuprofen and codeine phosphate (prn morphine sulphate 0.1mg|kg QDS for children)<br/> IV co-amoxiclav.",
				"flags": "Nil"
			}]
		};

		service.setClinEntries = function(data, address) {
			service.clinicalEntries = data;
			// service.clinAddress = address;

		}


		service.createNew = function(title, state) {
			//passes the title in from the scope to be then used by the edit controller
			newTitle = title;
			var newItem = {};
			if (state == "department") {
				newItem = {
					"title": title,
					"data": []
				};
				service.entries.admin.push(newItem);
			} else {
				newItem = {
					title: newTitle
				};
				service.clinicalEntries.clinical.push(newItem)
			}


		};

		service.getNew = function() {
			//return title to the edit controller
			return newTitle;
		};

		service.move = function(index, state, direction) {
			var moveItem = {};
			//if direction is -1 move up in array +1 move down- gives an array so take object 0
			if (state == "department") {
				moveItem = service.entries.admin.splice(index, 1)[0];

				service.entries.admin.splice(index + direction, 0, moveItem);
			} else {
				moveItem = service.clinicalEntries.clinical.splice(index, 1)[0];
				// console.log(moveItem);
				service.clinicalEntries.clinical.splice(index + direction, 0, moveItem);
			}
		}

		service.save = function(newObject, index) {

			if (index == service.entries.length) {
				service.entries.admin.push(newObject);
			} else {
				//need to add the objects
				//service.entries.admin[index] is the correct place
				service.entries.admin[index] = newObject;
			}

		};



		service.remove = function(index, state) {
			if (state == "department") {
				service.entries.admin.splice(index, 1);
			} else {
				service.clinicalEntries.clinical.splice(index, 1);
			}
		}

		service.download = function(state) {
			//from http://stackoverflow.com/questions/16329293/save-json-string-to-client-pc-using-html5-api
			// console.log(state);
			var data = service.entries;
			if (state == "clinical") {
				var data = service.clinicalEntries;
			}
			// console.log(data);

			var json = JSON.stringify(data);
			var blob = new Blob([json], {
				type: "application/json"
			});
			var url = URL.createObjectURL(blob);

			if (state == "department") {
				var a = document.createElement('a');
				a.download = "department.json";
				a.href = url;
				a.textContent = "Download department.json";
			} else {
				var a = document.createElement('a');
				a.download = "clinical.json";
				a.href = url;
				a.textContent = "Download clinical.json";
			}

			return a;

		}


		return service;
	})
