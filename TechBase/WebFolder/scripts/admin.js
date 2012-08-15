
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button6 = {};	// @button
	var button2 = {};	// @button
	var button4 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

function showApplication(okToShow) {
	if (okToShow) {
		$$("signInContainer").hide();
		$$("signOutContainer").show();
		$$("splashScreenContainer").hide();
		$$("bodyContainer").show();
		$("#splashScreenContainer").css("top", "-1px");
		$$("richText2").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
	} else {
		$$("signOutContainer").hide();
		$$("signInContainer").show();
		$$("bodyContainer").hide();
		$$("splashScreenContainer").show();
		$("#splashScreenContainer").css("top", "91px");
		$$("richText2").setValue("");
	}
}

function signIn() {
	//Sign In
	$("#errorDiv2").html("");
	
	if (WAF.directory.loginByPassword(WAF.sources.loginObj.userName, WAF.sources.loginObj.password)) {
		showApplication(true);
		WAF.sources.user.all();
		$$("textField1").setValue("");
		$$("textField2").setValue("");
	} else {
		$("#errorDiv2").html("Invalid login.");
	}
}

// eventHandlers// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
			// Sign Out
			if (WAF.directory.logout()) {
				showApplication(false);
			}
			$("#errorDiv2").html("");
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		//Sign In
		signIn();
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		//Save Ticket
		WAF.sources.user.save({
			onSuccess: function(event) {
				$("#errorDiv1").html("User account updated successfully.");
			},
			onError: function(error) {
				$("#errorDiv1").html(error['error'][0].message);
			}
		});
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$("#textField3").attr("disabled", true);
		$("#errorDiv1").html();
		$("#errorDiv2").html("");
		
		//roles
		roleArray = [];
		roleArray.push({name: ''});
		roleArray.push({name: 'client'});
		roleArray.push({name: 'tech'});
		roleArray.push({name: 'admin'});
		WAF.sources.roleArray.sync();
		
		if (WAF.directory.currentUser() === null) {
			showApplication(false);
		} else {
			showApplication(true);
		}
		
		$('#textField1, #textField2').live('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signIn();
	    	}
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
