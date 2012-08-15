
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button2 = {};	// @button
	var documentEvent = {};	// @document
	var button3 = {};	// @button
	var button1 = {};	// @button
	var dataGrid1 = {};	// @dataGrid
// @endregion// @endlock

// eventHandlers// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		//Cancel ticket
		$$("tabView1").selectTab(1);
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		WAF.sources.ticket.all();
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		//Save a ticket
		WAF.sources.ticket.save({
			onSuccess: function(event) {
				// put the current entity in the datasource's entity collection
				sources.ticket.addEntity(sources.ticket.getCurrentElement()); 
				$$("tabView1").selectTab(1);
			},
			onError: function(error) {
				$$("tabView1").selectTab(1);
			}
		});
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		//Add new ticket
		ds.Ticket.newTicket({
			autoExpand: "client",
			onSuccess: function(event) {
				WAF.sources.ticket.setCurrentEntity(event.result);  //pos will be -1
				$$("tabView1").selectTab(2); 
			}
		});
		
	};// @lock

	dataGrid1.onRowDblClick = function dataGrid1_onRowDblClick (event)// @startlock
	{// @endlock
		$$("tabView1").selectTab(2);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("dataGrid1", "onRowDblClick", dataGrid1.onRowDblClick, "WAF");
// @endregion
};// @endlock
