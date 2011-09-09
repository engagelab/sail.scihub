//    DRONNING MAUDS GATE 10-11
//    ENTRANCE FROM MUNKEDAMSVEIEN


SciHub = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
    xmppDomain: 'imediamac28.uio.no',
    groupchatRoom: 'scihub@conference.imediamac28.uio.no',
    
    init: function() {
        console.log("Initializing...")
        
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

        if (!SciHub.token) {
            Rollcall.Authenticator.requestLogin()
        } else {
            SciHub.rollcall.fetchSessionForToken(SciHub.token, function(data) {
                SciHub.session = data.session
                $(SciHub).trigger('authenticated')
            })
        }
    },
    
    
    createVideoBaloon: function(data) {
        balloon = $("<div class='balloon video'></div>")
        
        loader = $("<div class='loader'></div>")
        loader.append("<img src='loader.gif' />")
        loader.append("<p>Please wait...</p>")
        
        balloon.append(loader)
        
        balloon.attr('id', 'foo')
        
        //balloon.addClass('author-'+author.replace(/[^a-z0-9]/i, '-'))
        
        balloon.hide()
        
        wall_height = $("#wall").height()
        wall_width = $("#wall").width()
        
        balloon.css('left', (Math.random() * (wall_width - 100) + 'px'))
        balloon.css('top', (Math.random() * (wall_height - 100) + 'px'))
        
        // balloon.dblclick(function() {
        //     expl = $(this).find('.explanation')
        //     if ($(expl).is(':visible'))
        //         $(expl).hide('slide', {direction: 'up', duration: 'fast'})
        //     else
        //         $(expl).show('slide', {direction: 'up', duration: 'fast'})
        // })
        
        $("#wall").append(balloon)
        
        balloon.show('puff', 'fast')
        balloon.mousedown(function() {
            zs = $('.balloon').map(function() {z = $(this).css('z-index'); return z == 'auto' ? 100 : parseInt(z)})
            maxZ = Math.max.apply(Math, zs)
            $(this).css('z-index', maxZ + 1)
        })
        
        balloon.draggable()
        return balloon
    },
    

    
    events: {
        sail: {
        	got_google_client_token: function(sev) {
        		url = sev.payload.url
        		token = sev.payload.token
                $('#submission-from').attr('action', url+"?nexturl="+document.location.href)
                $('#token-value').val(token)
                console.log(token)
                console.log(url)

            }
        },
        
        initialized: function(ev) {
            SciHub.authenticate()
            $('#add').hide()				//moved to here to get it to hide earlier, but it ain't working
        },
        
        connected: function(ev) {
            SciHub.groupchat.join()
            $('#username').text(session.account.login)
      	    //$('#connecting').hide()						
        	
            //init VIEW screen
            
            $('.upload-screen-button').click(function() {
            	sev = new Sail.Event('video_upload_requested',{})
            	SciHub.groupchat.sendEvent(sev)
            	//$('#view').hide()
            	Sail.UI.showDialog("#add")
            })
            

            //init ADD screen
                        
            $('#add .back-button').click(function() {
            	Sail.UI.dismissDialog("#add")
            	//$('#view').show()
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
