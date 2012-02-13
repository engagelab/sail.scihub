var SciHub = {
	rollcallURL : '/rollcall',
	xmppDomain: 'imediamac28.uio.no',
	groupchatRoom : 'scihub@conference.imediamac28.uio.no',

	init : function() {
		console.log("Initializing...");

		// this is currently unused in SciHub
		Sail.app.run = JSON.parse($.cookie('run'));

		Sail.modules
			.load('Rollcall.Authenticator', {mode : 'picker'})
			.load('Strophe.AutoConnector')
			.load('AuthStatusWidget').thenRun(function() {
				Sail.autobindEvents(SciHub);
				$(document).ready(function() {
					$('#reload').click(function() {
						console.log("Disconnecting...");
						Sail.Strophe.disconnect();
						console.log("Reloading " + location + "...");
						location.reload();
					});
				});

			$(Sail.app).trigger('initialized');
			return true;
		});
	},
	
	authenticate : function() {
		console.log("Authenticating...");

		SciHub.rollcall = new Rollcall.Client(SciHub.rollcallURL);
		SciHub.token = SciHub.rollcall.getCurrentToken();

		if(!SciHub.token) {
			Rollcall.Authenticator.requestLogin();
		} else {
			SciHub.rollcall.fetchSessionForToken(SciHub.token, function(data) {
				SciHub.session = data.session;
				$(SciHub).trigger('authenticated');
			});
		}
	},
	
	events : {
		sail : {
			got_client_token : function(sev) {
				var token = sev.payload.token;

				console.log(token);

				Sail.app.createVideoBalloon(token);
				console.log("video created");
			},
			got_google_client_token : function(sev) {
				var tokenURL = sev.payload.url;
				var token = sev.payload.token;

				var nexturl = encodeURI(document.location.href.replace(/\?.*/, '') + '#token=' + token);
				$('#submission-form').attr('action', tokenURL + "?nexturl=" + nexturl);
				//$('#submission-form').get(0).setAttribute('action', tokenURL+"?nexturl="+nexturl);
				$('#token-value').val(token);
				console.log(token);
				console.log(tokenURL);
				Sail.app.createVideoBalloon(token);
				console.log("video created");
			},
			video_ready : function(sev) {
				$("span").text("funky");
				var videoReadyURL = sev.payload.url;
				var token = sev.payload.token;

				console.log(videoReadyURL);
				$('.token-' + token + ' .loader').remove();

				var player = SciHub.createVideoPlayer(videoReadyURL);
				$('.token-' + token).append(player);
				player[0].loadVideo();
			},
			
			welcome: function(sev) {
				$("span").text("fuck me sideways");
			}
		},

		initialized : function(ev) {
			SciHub.authenticate();
		},
		
		connected : function(ev) {
			$("span").text("fuck");
			
			var id = '';
            var idMatch = document.location.href.match(/id=([^&#]+)/);
            if (idMatch) {
                id = idMatch[1];
            }

            var status = '';
            var statusMatch = document.location.href.match(/status=([^&#]+)/);
            if (statusMatch) {
                status = statusMatch[1];
            }
            
            var token = '';
            var tokenMatch = document.location.href.match(/token=([^&#]+)/);
            if (tokenMatch) {
                token = tokenMatch[1];
            }
            
            if (status === '200' || status === 200) {
                var sev = new Sail.Event('video_uploaded',{
                    id:id,
                    status:status,
                    token:token
                });
                SciHub.groupchat.sendEvent(sev);
            }
		},
		
		authenticated : function(ev) {
			$(".scene-picker-ui").click(function(e) {
				var value;

				switch ($(".scene-picker-ui").index(this)) {
					case 0 :
						//go to simulations, load simulation 1
						$("#scene-picker").fadeOut();
						SciHub.createSimLeve1();
						break;
					case 1 :
						break;
					case 2 :
						break;
				}
			});
		},
		logout : function(ev) {
			Sail.app.run = null;
		}
	},

	createSimLeve1 : function() {
		//some clean-up first
		$("#simulations").remove("#simu1");
				
		$("#simulations").append("<link rel='stylesheet' rev='stylesheet' href='css/scih/simu1.css'>");
		simu1 = $("<div id='simu1'></div>");
		simu1.append("<img src='images/simu1.png' id='bkgSimu' alt='Simulation level 1 model' />");
		simu1.append("<div id='stepper'><button id='inc' onclick='increment(incText)'>+</button><button id='dec' onclick='decrement(incText)'>-</button><input type='text' size='10' readonly='readonly' onkeypress='return isNumberKey(event)' name='incText' value='0' /><span class='whiteText'>kW/h</span></div>");
		simu1.append("<div id='enerIn'><span class='whiteText' id='enerInVal'>0</span><span class='whiteText'>kW/h</span></div>");
		simu1.append("<div id='coefQuestion'><span class='whiteText'>Coefficient of Performance ?</span></div>");
		simu1.append("<div id='enerOut'><p><span id='houseWatt'>0</span> kW/h</p><p><span id='expEner'>0</span> NOK/h tilført</p><p><span id='freeEner'>0</span> NOK/h fra omgivelsen</p></div>");
		simu1.append('<input type="button" value="next" id="btn-nextSimu1" />');

		$("#simulations").append(simu1);
		$("#simulations").append("<script src='js/scih/simu1.js'></script>");
	}
};
