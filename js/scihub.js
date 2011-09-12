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
    
    
    createVideoBalloon: function(token, url) {
        balloon = $("<div class='balloon video' ></div>")
        
        if (url) {
            player = $("<object class='player'></object>")
            player.append("<param name='movie' value='"+url+"'></param>")
            player.append("<param name='allowFullScreen' value='true'></param>")
            player.append("<param name='allowScriptAccess' value='always'></param>")
            player.append("<embed src='"+url+"' type='application/x-shockwave-flash' allowfullscreen='true' allowscriptaccess='always'></embed>")
            
            balloon.append(player)
        } else {
            loader = $("<div class='loader'></div>")
            loader.append("<img src='loader.gif' />")
            loader.append("<p>Please wait...</p>")
            
            balloon.append(loader)
        }
        
        
        balloon.addClass('token-' + token)
        
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
        		tokenURL = sev.payload.url
        		token = sev.payload.token
                //$('#submission-form').attr('action', url+"?nexturl="+document.location.href)
        		nexturl = escape(document.location.href + '#token='+token)
                $('#submission-form').get(0).setAttribute('action', tokenURL+"?nexturl="+nexturl);
                $('#token-value').val(token)
                console.log(token)
                console.log(tokenURL)
                Sail.app.createVideoBalloon(token)
                console.log("video created")
            },
            video_ready: function(sev) {
            	videoReadyURL = sev.payload.url
            	token = sev.payload.token
            	
            	console.log(videoReadyURL)
            	$('.token-'+token+' .loader').remove()
            }
   
        },
        
        initialized: function(ev) {
            SciHub.authenticate()
        },
        
        connected: function(ev) {
            SciHub.groupchat.join()
            $('#username').text(session.account.login)					
        	
            //init VIEW screen
            
            
            $('.upload-screen-button').click(function() {
            	sev = new Sail.Event('video_upload_requested',{})
            	SciHub.groupchat.sendEvent(sev)
            	//$('#view').hide()
            	Sail.UI.showDialog("#add")
            	$('#add .ui-dialog-titlebar-close')
            	    .click(function() {Sail.UI.dismissDialog("#add")})
            	    .mouseover(function() {$(this).addClass('ui-state-hover')})
                    .mouseout(function() {$(this).removeClass('ui-state-hover')})
            })
            
            $('.upload-screen-button').show('fade');
            
            $('#connecting').hide()	

            //init ADD screen
            
            $().sleepyMongo({sleepyUrl:'/mongoose/scihub/videos/'}).find({}, function(data){
                $(data.results).each(function() {
                    Sail.app.createVideoBalloon('', this.url)
                })
            })


            id = ''
            idMatch = document.location.href.match(/id=([^&]+)/)
            if (idMatch)
            	id = idMatch[1]

            status = ''
            statusMatch = document.location.href.match(/status=([^&]+)/)
            if (statusMatch)
            	status = statusMatch[1]
            
            token = ''
            tokenMatch = document.location.href.match(/token=([^#]+)/)
            if (tokenMatch)
            	token = tokenMatch[1]


            if (status == '200') {
            	sev = new Sail.Event('video_uploaded',{
            		id:id,
            		status:status,
            		token:token
            	})
            	SciHub.groupchat.sendEvent(sev)
            }
            
            
        },        

        authenticated: function(ev) {
                      
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
