SciHub = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
    xmppDomain: 'proto.encorelab.org',
    groupchatRoom: null,
    
    init: function() {
        console.log("Initializing...")
        
        Sail.app.run = JSON.parse($.cookie('run'))
        if (Sail.app.run) {
            Sail.app.groupchatRoom = Sail.app.run.name+'@conference.'+Sail.app.xmppDomain
        }
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'multi-picker'})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(SciHub)
                
                $(document).ready(function() {
                    $('#reload').click(function() {
                        console.log("Disconnecting...")
                        Sail.Strophe.disconnect()
                        console.log("Reloading "+location+"...")
                        location.reload()
                    })

                    $('#connecting').show()
                    
                })

                $(Sail.app).trigger('initialized')
                return true
            })
    },
   
    authenticate: function() {
        console.log("Authenticating...")
        
        SciHub.rollcall = new Rollcall.Client(SciHub.rollcallURL)
        SciHub.token = SciHub.rollcall.getCurrentToken()

        if (!SciHub.run) {
            if ($.url.attr('file') != 'index.html')
                window.location.href = "/index.html"
        } else if (!SciHub.token) {
            Rollcall.Authenticator.requestLogin()
        } else {
            SciHub.rollcall.fetchSessionForToken(SciHub.token, function(data) {
                SciHub.session = data.session
                $(SciHub).trigger('authenticated')
            })
        }
    },
    
    showMyVideos: function(data) {
  	  var feed = data.feed;
  	  var entries = feed.entry || [];
  	  var html = ['<ul>'];
  	  for (var i = 0; i < entries.length; i++) {
  	    var entry = entries[i];
  	    var title = entry.title.$t;
  	    html.push('<li>', title, '</li>');
  	  }
  	  html.push('</ul>');
  	  document.getElementById('videos').innerHTML = html.join('');
    }, 
    
    events: {
        sail: {
            
        },
        
        initialized: function(ev) {
            SciHub.authenticate()
        },
        
        connected: function(ev) {
            SciHub.groupchat.join()
            $('#username').text(session.account.login)
      	    //$('#connecting').hide()						
        	
            ///////////////////////////////MOVE THIS TO ITS OWN DIRECTORY ONCE IT GROWS///////////////////////////////////
            $('#add').hide()
            
            $('#view .upload-video-button').click(function() {
            	//some stuff
            })
            
                         
        },
        
        
        
        authenticated: function(ev) {
            $('#connecting').hide()
        },
        
        logout: function(ev) {
            Sail.app.run = null
        }
    }    
} 
    /*    phonegap: function() {
    $('#camera').click(function() {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 15 }); 

        function onSuccess(imageData) {
          var image = document.getElementById('photo');
          image.src = "data:image/jpeg;base64," + imageData;
        }

        function onFail(message) {
          alert('Failed because: ' + message);
        }
    })
    
    $('#phonegap-info').html(JSON.stringify(navigator.device).replace(/,/g,',<br />'))
    
    navigator.accelerometer.watchAcceleration(
        function(acc) {
            $('#accelerometer').text("x: "+acc.x+", y:"+acc.y+", z:"+acc.z)
        }
    )
    
    navigator.compass.watchHeading(
        function(heading) {
            $('#compass').text(heading)
        }
    )
    
    navigator.geolocation.watchPosition(
        function(position) {
            $('#geolocation').text("Lat: "+acc.coords.latitude+", Long:"+acc.coords.longitude)
        }
    )
    
    $('#alert').click(function() {
        navigator.notification.alert("This is an alert!", null, "Uh oh!", "Okay")
    })
    
    $('#confirm').click(function() {
        navigator.notification.alert("This is a confirmation!", null, "Yay!", "Alright")
    })
    
    $('#beep').click(function() {
        navigator.notification.beep(3)
    })
    
    $('#vibrate').click(function() {
        navigator.notification.vibrate(1000)
    })
},
*/    
