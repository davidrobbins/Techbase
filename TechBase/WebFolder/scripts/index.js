
WAF.onAfterInit = function onAfterInit() {// @lock
	function signUp() {
		var signUpData = {
			login: WAF.sources.signUpObject.login,
			password: WAF.sources.signUpObject.password,
			repeat: WAF.sources.signUpObject.repeat,
			fullName: WAF.sources.signUpObject.fullName,
			email: 	WAF.sources.signUpObject.email			
		};

		WAF.ds.User.addUser({
			onSuccess: function(event) {
				$("#errorDiv1").html(event.result.message);
				switch(event.result.error) {
					case 1410:
					//label4, label29
					//$("#label4, #label33").css("border", "1px solid red");
					
					//$("#label4, #label33").css("color", "red");
					
					var labelWidget=$$('textField4').getLabel();
					labelWidget.setTextColor("green");
					var labelWidget=$$('textField29').getLabel();
					labelWidget.setTextColor("green");

					break;
					
				}

				if (WAF.directory.currentUser() !== null) {
					$$("signInContainer").hide();
					$$("signOutContainer").show();
					$$("tabView1").selectTab(2);
					WAF.source.queryStatusArray.select(0);
					WAF.sources.ticket.query("status = :1", "open");
					$$("richText6").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
					
					signUpObject.login = "";
					signUpObject.password = "";
					signUpObject.fullName = "";
					signUpObject.repeat = "";
					signUpObject.email = "";
					WAF.sources.signUpObject.autoDispatch();
				}
				
			}
//			,
//			onError: function(error) {
//				$("#errorDiv1").html(error['error'][0].message);
//			}
		}, signUpData);	
	} 

	function signIn() {
		$("#errorDiv1").html("");
		if (WAF.directory.loginByPassword(WAF.sources.loginObject.name, WAF.sources.loginObject.password)) {
		//if (WAF.directory.loginByPassword($$("textField1").getValue(), $$("textField2").getValue())) {
			//Let's show only open tickets.
			WAF.source.queryStatusArray.select(0);
			WAF.sources.ticket.query("status = :1", "open");
			//WAF.sources.ticket.orderBy("createDate desc");
			$$("signInContainer").hide();
			$$("signOutContainer").show();
			$$("tabView1").selectTab(2);

			$$("textField1").setValue("");
			$$("textField2").setValue("");
			$$("richText6").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
			
			if (WAF.directory.currentUserBelongsTo("Admin")) {
				$("#textField12").attr("disabled", true);
			} else if (WAF.directory.currentUserBelongsTo("tech")) {
				$("#textField12").attr("disabled", true);
			} else if (WAF.directory.currentUserBelongsTo("client")) {
				$("#textField12").removeAttr("disabled");
			} else {
				$("#textField12").attr("disabled", true);
			}
			
		} else {
			//$("#errorDiv1").html("Invalid login.");
			$$("errorDiv1").setValue("test");
		}
	} //End function signIn

// @region namespaceDeclaration// @startlock
	var button2 = {};	// @button
	var button1 = {};	// @button
	var button14 = {};	// @button
	var button13 = {};	// @button
	var statusArrayEvent = {};	// @dataSource
	var queryStatusArrayEvent = {};	// @dataSource
	var button7 = {};	// @button
	var button9 = {};	// @button
	var dataGrid2 = {};	// @dataGrid
	var button6 = {};	// @button
	var button5 = {};	// @button
	var dataGrid1 = {};	// @dataGrid
	var textField10 = {};	// @textField
	var button4 = {};	// @button
	var button3 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock


// eventHandlers// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		// Cancel event detail
		$$("tabView1").selectTab(4);
		$("#errorDiv1").html("");
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		// Save event detail
		WAF.sources.eventCollection.save({
			onSuccess: function(event) {
				$("#errorDiv1").html("Event updated.");
				WAF.sources.eventCollection.serverRefresh();
			},
			onError: function(error) {
				$("#errorDiv1").html(error['error'][0].message);
			}
		}); 
		$$("tabView1").selectTab(4);
		$("#errorDiv1").html("");
	};// @lock

	button14.click = function button14_click (event)// @startlock
	{// @endlock
		//Sign In
		signIn();
	};// @lock

	button13.click = function button13_click (event)// @startlock
	{// @endlock
		//Sign Out
		if (WAF.directory.logout()) {
			//Sign Out   Sign Out    Sign Out
			$$("signOutContainer").hide();
			$$("signInContainer").show();
			$("#errorDiv1").html("");
			$$("tabView1").selectTab(1);
			$$("richText6").setValue("");
			WAF.sources.ticket.query("status = :1", "open");
			WAF.sources.ticket.setEntityCollection();
		}
	};// @lock

	statusArrayEvent.ontitleAttributeChange = function statusArrayEvent_ontitleAttributeChange (event)// @startlock
	{// @endlock
		//Status Change
		WAF.sources.ticket.updateStatus({
			onSuccess: function(event) {
				$("#errorDiv1").html(event.result.message);
				WAF.sources.ticket.serverRefresh();
			}
		}, WAF.sources.statusArray.title);
	};// @lock

	queryStatusArrayEvent.ontitleAttributeChange = function queryStatusArrayEvent_ontitleAttributeChange (event)// @startlock
	{// @endlock
		//Query status combo box
		if (WAF.sources.queryStatusArray.title === "all") 
			WAF.sources.ticket.all();
		else
			WAF.sources.ticket.query("status = :1", WAF.sources.queryStatusArray.title);
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		// Add a new event.
		WAF.sources.eventCollection.addNewElement();
		WAF.sources.eventCollection.save({
			onSuccess: function(event) {
				$("#errorDiv1").html("Event added.");
				WAF.sources.eventCollection.serverRefresh();
				$$("tabView1").selectTab(5); 
			},
			onError: function(error) {
				$("#errorDiv1").html(error['error'][0].message);
			}
		}); 

		//$("#errorDiv1").html("");
		//WAF.sources.event.addNewElement();
		//var theEvent = ds.Event.newEvent();
		//WAF.sources.event.setCurrentEntity(theEvent);
		//$$("tabView1").selectTab(5); 
		
		/*
		ds.Ticket.newEvent({
			autoExpand: "tech",
			onSuccess: function(event) {
				WAF.sources.eventCollection.setCurrentEntity(event.result);
				$$("tabView1").selectTab(5); 
			}
		});
		*/
	};// @lock

	button9.click = function button9_click (event)// @startlock
	{// @endlock
		// Cancel Ticket
		$$("tabView1").selectTab(2); 
		$("#errorDiv1").html("");
	};// @lock

	dataGrid2.onRowDblClick = function dataGrid2_onRowDblClick (event)// @startlock
	{// @endlock
		//Double click events
		$$("tabView1").selectTab(5);
		$("#errorDiv1").html("");
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		// Back from Tech detail to list
		WAF.sources.ticket.serverRefresh();
		$$("tabView1").selectTab(2); 
		$("#errorDiv1").html("");
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		//New Ticket button.
		$("#errorDiv1").html("");
		ds.Ticket.newTicket({
			autoExpand: "client",
			onSuccess: function(event) {
				WAF.sources.ticket.setCurrentEntity(event.result);
				$$("tabView1").selectTab(3); 
			}
		});
		
	};// @lock

	dataGrid1.onRowDblClick = function dataGrid1_onRowDblClick (event)// @startlock
	{// @endlock
		$("#errorDiv1").html("");
		
		if (WAF.directory.currentUserBelongsTo("Admin")) {
			$$("tabView1").selectTab(4);
		} else if (WAF.directory.currentUserBelongsTo("tech")) {
			$$("tabView1").selectTab(4);
		} else if (WAF.directory.currentUserBelongsTo("client")) {
			$$("tabView1").selectTab(3);
		} else {
			$("#errorDiv1").html("Access denied. You are not a member of any of the priviledged groups.");
		}
		
	};// @lock

	textField10.keyup = function textField10_keyup (event)// @startlock
	{// @endlock
		var queryString = "*" + $$("textField10").getValue() + "*";
		if (WAF.sources.queryStatusArray.title === "all")
			WAF.sources.ticket.query("problemDescription = :1", queryString);
		else
			WAF.sources.ticket.query("problemDescription = :1 and status = :2", queryString, WAF.sources.queryStatusArray.title);
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		//Save Ticket 
		var primKey = WAF.sources.ticket.ID;
		WAF.sources.ticket.save({
			onSuccess: function(event) {
				//var primKey = WAF.sources.ticket.currentElement().getKey();
				WAF.source.queryStatusArray.select(0);
				WAF.sources.ticket.query("status = :1", "open", {
					onSuccess: function (event) {
						WAF.sources.ticket.selectByKey(primKey);
					}
				});
				//WAF.sources.ticket.orderBy("createDate desc");
				$("#errorDiv1").html("Ticket " + WAF.sources.ticket.ID + " has been updated on the server.");
				$$("tabView1").selectTab(2);
			},
			onError: function(error) {
				$("#errorDiv1").html(error['error'][0].message);
				//WAF.sources.ticket.all();
				if (WAF.sources.queryStatusArray.title === "all") 
					WAF.sources.ticket.all();
				else
					WAF.sources.ticket.query("status = :1", WAF.sources.queryStatusArray.title);
				$$("tabView1").selectTab(2);
			}
		});
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		signUp();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$('#textField1, #textField2').on('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signIn();
	    	}
		});
		
		$('#textField3, #textField4, #textField5, #textField29, #textField30').on('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signUp();
	    	}
		});
		
		
		//query status array
		queryStatusArray = [{title: 'open'}, {title: 'assigned'}, {title: 'closed'}, {title: 'all'}];
		WAF.sources.queryStatusArray.sync();
		//status array
		statusArray = [{title: ''}, {title: 'open'}, {title: 'assigned'}, {title: 'closed'}];
		WAF.sources.statusArray.sync();
		//hardware array
		//hardwareArray = [{title: ''}, {title: 'iPad'}, {title: 'iPhone'}, {title: 'Dell'}, {title: 'Macbook'}];
		//WAF.sources.hardwareArray.sync();
		//OS Array
		//osArray = [{title: ''}, {title: 'Windows'}, {title: 'Mac'}, {title: 'iOS'}, {title: 'Linux'}];
		//WAF.sources.osArray.sync();

		if (WAF.directory.currentUser() === null) {
			$$("signInContainer").show();
			$$("signOutContainer").hide();
			$$("tabView1").selectTab(1);
			$$("richText6").setValue("");
		} else {
			$$("signInContainer").hide();
			$$("signOutContainer").show();
			$$("tabView1").selectTab(2);
			if (WAF.sources.queryStatusArray.title === "all") 
				WAF.sources.ticket.all();
			else
				WAF.sources.ticket.query("status = :1", WAF.sources.queryStatusArray.title);
			
			$$("richText6").setValue("Signed in as : " + WAF.directory.currentUser().fullName);

			if (WAF.directory.currentUserBelongsTo("Admin")) {
				$("#textField12").attr("disabled", true);
			} else if (WAF.directory.currentUserBelongsTo("tech")) {
				$("#textField12").attr("disabled", true);
			} else if (WAF.directory.currentUserBelongsTo("client")) {
				$("#textField12").removeAttr("disabled");
			} else {
				$("#textField12").attr("disabled", true);
			}
		}
		
		//event ticket status
		eventStatusArray = [];
		//eventStatusArray.push({title: ''});
		eventStatusArray.push({title: 'open'});
		eventStatusArray.push({title: 'info'});
		eventStatusArray.push({title: 'closed'});
		WAF.sources.eventStatusArray.sync();
		
		//disable some textFields on tab 3
		$("#textField6").attr("disabled", true); //Ticket ID
		$("#textField8").attr("disabled", true); // Ticket Status
		$("#textField9").attr("disabled", true); //Create Date
		$("#textField17").attr("disabled", true); //Client Name
		$("#textField24").attr("disabled", true); //Tech Name
		
		//disable some textFields on tab 4
		$("#textField11").attr("disabled", true); //Ticket ID
		$("#textField14").attr("disabled", true); //Create Date
		$("#textField22").attr("disabled", true); //Hardware
		$("#textField23").attr("disabled", true); //OS
		$("#textField25").attr("disabled", true); //Client Name
		$("#textField26").attr("disabled", true); //Tech Name
		
		//tab 5
		$("#textField13").attr("disabled", true); //Ticket ID
		$("#textField19").attr("disabled", true); //Ticket Status
		$("#textField15").attr("disabled", true); //Ticket Create Date
		$("#textField16").attr("disabled", true); //Ticket Problem Description
		$("#textField28").attr("disabled", true); //Ticket Hardware
		
//		$("#textField18").attr("disabled", true);
//		$("#textField19").attr("disabled", true);
//		$("#textField20").attr("disabled", true);
//		$("#textField21").attr("disabled", true);
//		$("#textField27").attr("disabled", true);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("button14", "click", button14.click, "WAF");
	WAF.addListener("button13", "click", button13.click, "WAF");
	WAF.addListener("statusArray", "ontitleAttributeChange", statusArrayEvent.ontitleAttributeChange, "WAF", "title");
	WAF.addListener("queryStatusArray", "ontitleAttributeChange", queryStatusArrayEvent.ontitleAttributeChange, "WAF", "title");
	WAF.addListener("button7", "click", button7.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("dataGrid2", "onRowDblClick", dataGrid2.onRowDblClick, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("dataGrid1", "onRowDblClick", dataGrid1.onRowDblClick, "WAF");
	WAF.addListener("textField10", "keyup", textField10.keyup, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
