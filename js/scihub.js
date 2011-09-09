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
        baloon = $("<div class='baloon video'></div>")
        
        loader = $("<div class='loader'></div>")
        loader.append("<img src='loader.gif' />")
        loader.append("<p>Please wait...</p>")
        
        baloon.append(loader)
        
        baloon.attr('id', 'foo')
        
        //baloon.addClass('author-'+author.replace(/[^a-z0-9]/i, '-'))
        
        baloon.hide()
        
        wall_height = $("#wall").height()
        wall_width = $("#wall").width()
        
        baloon.css('left', (Math.random() * (wall_width - 100) + 'px'))
        baloon.css('top', (Math.random() * (wall_height - 100) + 'px'))
        
        // baloon.dblclick(function() {
        //     expl = $(this).find('.explanation')
        //     if ($(expl).is(':visible'))
        //         $(expl).hide('slide', {direction: 'up', duration: 'fast'})
        //     else
        //         $(expl).show('slide', {direction: 'up', duration: 'fast'})
        // })
        
        $("#wall").append(baloon)
        
        baloon.show('puff', 'fast')
        baloon.mousedown(function() {
            zs = $('.baloon').map(function() {z = $(this).css('z-index'); return z == 'auto' ? 100 : parseInt(z)})
            maxZ = Math.max.apply(Math, zs)
            $(this).css('z-index', maxZ + 1)
        })
        
        baloon.draggable()
        return baloon
    },
    

    
    events: {
        sail: {
            
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
            
            $('#view .upload-screen-button').click(function() {
            	$('#view').hide()
            	$('#add').show()
            })
            

            //init ADD screen
            
            $('#add .upload-button').click(function() {
            	//$('#add .title').val()
            	sev = new Sail.Event('video_upload_requested',{ })
            	SciHub.groupchat.sendEvent(sev)
            })
            
            
            $('#add .browse-button').click(function() {
            	//something
            })
            $('#add .back-button').click(function() {
            	$('#add').hide()
            	$('#view').show()
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
