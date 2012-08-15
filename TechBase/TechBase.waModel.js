
guidedModel =// @startlock
{
	OS :
	{
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				// OS (Operating System) restricting query
				var result;
				result = ds.Choice.query("category = :1", "OS");
				return result;
			}// @startlock
		}
	},
	Hardware :
	{
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				// Hardware restricting query
				var result;
				result = ds.Choice.query("category = :1", "Hardware");
				return result;
			}// @startlock
		}
	},
	Choice :
	{
		events :
		{
			onInit:function()
			{// @endlock
				//get the name of the class of the entity 
    			var myType = this.getDataClass().getName(); 
        		//store it in the category attribute 
    			this.category = myType; 
			}// @startlock
		}
	},
	Event :
	{
		methods :
		{// @endlock
			newEvent:function()
			{// @lock
				// create new event and return it.
				return new ds.Event();
			}// @startlock
		},
		events :
		{
			onInit:function()
			{// @endlock
				this.status = "open";
				//this.assessment = "Please enter assessment.";
				//this.actionsTaken = "Please enter actions taken.";
				
				var myCurrentUser = currentUser(); // we get the user of the current session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID);
				this.tech = myUser;
				
			}// @startlock
		}
	},
	Ticket :
	{
		methods :
		{// @endlock
			newTicket:function()
			{// @lock
				// New Ticket 
				return new ds.Ticket();
			}// @startlock
		},
		entityMethods :
		{// @endlock
			updateStatus:function(status)
			{// @lock
				var sessionRef = currentSession(); // Get session.
				if (sessionRef.belongsTo("tech")) {
					//if ((status === "assigned") || (status === "closed")) {
					if ((status === "assigned") || (status === "closed"))  {
						var myCurrentUser = currentUser(); // we get the user of the current session.
						this.tech = ds.User(myCurrentUser.ID);	
						
						//Send out an email notification to the client when a ticket is assigned.
						// Pass this off to our shared email worker.
						var theEmailWorker = new SharedWorker("sharedWorkers/emailDaemon.js", "emailDaemon");
						var thePort = theEmailWorker.port; // MessagePort to communicate with the email shared worker.
						thePort.postMessage({what: 'send email',
							status: status,
							ticketID : this.ID,
							problemDescription: this.problemDescription,
							name: this.tech.fullName,
							email: this.client.eMail
						});
					
					}
					this.status = status;
					//debugger;
					try {
						this.save();
						return {message: "The ticket status has been updated."};
						}
						catch(e) {
							return {message: "The status of this ticket could not be updated."};
						} //end try
					
				} else {
					return {message: "You do not have the proper priviledges to update the status."};
				}
				
			}// @startlock
		},
		events :
		{
			onSave:function()
			{// @endlock
				if (this.isNew()) {
					//Send out an email notification to the techs when a ticket is created.
					// Pass this off to our shared email worker.
					var theEmailWorker = new SharedWorker("sharedWorkers/emailDaemon.js", "emailDaemon");
					var thePort = theEmailWorker.port; // MessagePort to communicate with the email shared worker.
					thePort.postMessage({what: 'send email',
						status: this.status,
						ticketID : this.ID,
						problemDescription: this.problemDescription,
						name: this.client.fullName,
						email: this.client.eMail
					});
				}
			},// @startlock
			onRestrictingQuery:function()
			{// @endlock
				//var result = ds.Ticket.createEntityCollection();
				var mySession = currentSession();
				var result;
				if (mySession.belongsTo("Admin")) {
					result = ds.Ticket.all();
				} else if (mySession.belongsTo("tech")) {
					result = ds.Ticket.all();
				} else if (mySession.belongsTo("client")) {
					result = ds.Ticket.query("client.login = :1", currentUser().name);
				} else {
					result = ds.Ticket.createEntityCollection();
				}
				
				return result;
			},// @startlock
			onValidate:function()
			{// @endlock
				/**/
				//debugger;
				var err;
				var theClass = this.getDataClass(); //get the dataclass of the entity to save
				var theClassName = theClass.getName(); //get the dataclass name
				var oldEntity = theClass(this.getKey()); //find the same entity on disk
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
				
				if (sessionRef.belongsTo("Admin")) {
					err = { error : 4100, 
					errorMessage: "The Administrator is not allowed to update tickets."};
					return err;
					
				} else if (sessionRef.belongsTo("tech")) {
					//tech can't open tickets.
					if (this.isNew()) {
						err = { error : 4302, 
						errorMessage: "Technicians are not allowed to open tickets."};
						return err;
					}
					
					//the tech can never update the problem description.
					if (!this.isNew()) {
						//debugger;
						//can't update it if it is closed.
						if (oldEntity.status === "closed") {
							err = { error : 4317, 
							errorMessage: "You cannot modify a closed ticket."};
							return err;
						}
						
						if (oldEntity === null) {
							err = { error : 4304, 
							errorMessage: "The entity on server could not be loaded. Update aborted."};
							return err;
						}
						
						if (this.problemDescription !== oldEntity.problemDescription) {
							err = { error : 4307, 
							errorMessage: "You do not have permission to change the problem description."};
							return err;
						}
						
						
						//Changing the hardware??
						if (this.hardware !== oldEntity.hardware) {
							err = { error : 4309, 
							errorMessage: "You do not have permission to change the hardware field."};
							return err;
						}
						
						//Changing the status??
						if (this.status !== oldEntity.status) {
							if (oldEntity.status === "closed") {
								err = { error : 4317, 
								errorMessage: "You cannot modify a closed ticket."};
								return err;
							}
							
							
							if (this.status === "open") {
								err = { error : 4317, 
								errorMessage: "You cannot set an assigned ticket back to open."};
								return err;
							}
							
							if ((this.status === "closed") && (oldEntity.status === "open")) {
								err = { error : 4317, 
								errorMessage: "You cannot close an open ticket."};
								return err;
							}
						}
						
					} //(!this.isNew())
					
					
				} else if (sessionRef.belongsTo("client")) {
					//client can never update the status.
					if (!this.isNew()) {
						
						if (this.problemDescription === "red") {
							err = { error : 4999, 
							errorMessage: "Red Alert. Update aborted."};
							return err;
						}
						
						
						if (oldEntity === null) {
							err = { error : 4404, 
							errorMessage: "Entity on server could not be loaded. Update aborted."};
							return err;
						}
						
						if (oldEntity.status === "assigned") {
							err = { error : 4317, 
							errorMessage: "You cannot modify a ticket that has been assigned."};
							return err;
						}
						
						if (oldEntity.status === "closed") {
							err = { error : 4317, 
							errorMessage: "You cannot modify a closed ticket."};
							return err;
						}
						
						if (this.status !== oldEntity.status) {
							err = { error : 4407, 
							errorMessage: "You do not have permission to change the status."};
							return err;
						}
					} //(!this.isNew())
					
				} else {
					//This session does not belong to any authorized group.
					err = { error : 4900, 
					errorMessage: "You are not authorized to update this ticket {" + this.ID + "}."};
					return err;
				}
				
				
				
			},// @startlock
			onInit:function()
			{// @endlock
				var sessionRef = currentSession(); // Get session.
				var promoteToken = sessionRef.promoteWith("Admin"); //temporarily make this session Admin level.
				var err;
				
				var myCurrentUser = currentUser(); // we get the user of the current session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID);
				var myCurrentDate = new Date(); // we get the current date.
				
				if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.
					this.createDate = myCurrentDate;
					this.client = myUser;
					this.status = "open";
				
				} else {
						err = { error : 4, errorMessage: "Ticket cannot be created." };
				}
				
				if (err != null) {
					return err;
				}//
				
				sessionRef.unPromote(promoteToken); //put the session back to normal.
				
			}// @startlock
		}
	},
	User :
	{
		methods :
		{// @endlock
			addUser:function(signUpData)
			{// @lock
				// Add a new account
				if (loginByPassword(signUpData.login, signUpData.password)) {
					return {message: "You are already signed up."};
				} else {
					
					if (signUpData.password !== signUpData.repeat) {
						return {error: 1410, message: "I'm sorry but you did not type in your password the same each time."};
					}
					
					
					var sessionRef = currentSession(); // Get session.
					var promoteToken = sessionRef.promoteWith("Admin"); //temporarily make this session Admin level.
					var newUser =  ds.User.createEntity();     
          			newUser.login = signUpData.login;     
          			newUser.password = signUpData.password;     
          			newUser.fullName = signUpData.fullName; 
          			newUser.eMail = signUpData.email; 
   
          			try {
						newUser.save();     // save the entity
						sessionRef.unPromote(promoteToken); //put the session back to normal.
          				if (loginByPassword(signUpData.login, signUpData.password)) {
          					return {message: "Congratulations on your new account " + signUpData.fullName + "!"};
          				} else {
          					return {message: "I'm sorry but we could not sign you up."};
						}
					}
					catch(e) {
						return {message: e.messages[1]};
					}
          
				}
			}// @startlock
		},
		events :
		{
			onInit:function()
			{// @endlock
				this.role = "client";
			},// @startlock
			onValidate:function()
			{// @endlock
				var err;
				
				//Check the email to see if it's valid.
				if (this.eMail !== null) {
					var emailRegexStr = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
					var isValid = emailRegexStr.test(this.eMail);
					
					if (!isValid) {
						err = {error: 401, errorMessage: "Email is invalid."};
					}
				}
				
				
				return err;
			},// @startlock
			onRestrictingQuery:function()
			{// @endlock
				var result = ds.User.createEntityCollection();
				if (currentSession().belongsTo("Admin")) {
					result = ds.User.all();
				} else if (currentSession().belongsTo("tech")) {
					result = ds.User.all();
				} else if (currentSession().belongsTo("client")) {
					result = ds.User.all();
					//result = ds.User.query("login = :1", currentUser().name);
				}
				
				return result;
				
			}// @startlock
		},
		entityMethods :
		{// @endlock
			validatePassword:function(password)
			{// @lock
				var ha1 = directory.computeHA1(this.ID, password);
				return (ha1 === this.HA1Key); //true if validated, false otherwise.
			}// @startlock
		},
		password :
		{
			onSet:function(value)
			{// @endlock
				this.HA1Key = directory.computeHA1(this.ID, value);
			},// @startlock
			onGet:function()
			{// @endlock
				return "*****";
			}// @startlock
		}
	}
};// @endlock
