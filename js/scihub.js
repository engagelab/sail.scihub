/*jslint regexp: false, browser: true */
/*globals $, Sail, Rollcall, swfobject */


var SciHub = {
    rollcallURL: '/rollcall', //'http://rollcall.proto.encorelab.org',
    groupchatRoom: 'scihub@conference.imediamac28.uio.no',
    
    init: function() {
        console.log("Initializing...");
        
        // this is currently unused in SciHub
        Sail.app.run = JSON.parse($.cookie('run'));
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'multi-picker'})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(SciHub);
                
                $(document).ready(function() {
                    $('#reload').click(function() {
                        console.log("Disconnecting...");
                        Sail.Strophe.disconnect();
                        console.log("Reloading "+location+"...");
                        location.reload();
                    });
                });
                
                $(Sail.app).trigger('initialized');
                return true;
            });
    },
   
    authenticate: function() {
        console.log("Authenticating...");
        
        SciHub.rollcall = new Rollcall.Client(SciHub.rollcallURL);
        SciHub.token = SciHub.rollcall.getCurrentToken();

        if (!SciHub.token) {
            Rollcall.Authenticator.requestLogin();
        } else {
            SciHub.rollcall.fetchSessionForToken(SciHub.token, function(data) {
                SciHub.session = data.session;
                $(SciHub).trigger('authenticated');
            });
        }
    },
    
    createVideoPlayer: function(url) {
        var videoId;
        var videoIdMatch = url.match(new RegExp('http://(?:www.)?youtube.com/v/([^?&]*)'));
        if (!videoIdMatch || !videoIdMatch[1]) {
            throw "Video url '"+url+"' could not be parsed to retrieve the video id!";
        } else {
            videoId = videoIdMatch[1];
        }
        
        // AS3 CHROMELESS PLAYER
        //        var yurl = "http://www.youtube.com/apiplayer?video_id="+video_id+"&version=3&showinfo=0&enablejsapi=1";
        //        var player = $("<object id='video-"+video_id+"' class='player'></object>")
        //                        .append("<param name='movie' value='"+yurl+"'></param>")
        //                        .append("<param name='allowFullScreen' value='true'></param>")
        //                        .append("<param name='allowScriptAccess' value='always'></param>")
        //                        .append("<embed class='player' src='"+yurl+"' type='application/x-shockwave-flash' allowfullscreen='true' allowscriptaccess='always'></embed>");               
        
        
        // AS3 CHROMELESS PLAYER USING swfobject.js
        var playerId = "video-player-"+videoId+'-'+Math.round(Math.random()*10e12).toString(32);
        var player = $('<div />').attr('id', playerId);
        player.data('video-id', videoId);
        player[0].loadVideo = function() {
            var playerId = $(this).attr('id');
            var videoId = $(this).data('video-id');            
            console.log("Loading video "+videoId);
            var params = { allowScriptAccess: "always", allowFullScreen: 'true' };
            var atts = { id: playerId };
            var yurl = "http://www.youtube.com/apiplayer?video_id="+videoId+"&version=3&showinfo=0&enablejsapi=1&playerapiid="+playerId;
            swfobject.embedSWF(yurl, playerId, "100%", "100%", "8", null, null, params, atts);
            
            var overlay = $("<div class='video-overlay'>");
            $('#'+playerId).after(overlay);
            
            overlay.dblclick(function() {
                var player = $(this).prevAll('object')[0];
                if (player.getPlayerState() === 1) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
            });
            
        };
        
        
    
        // AS3 PLAYER
        // var yurl = url + "&version=3"
        // var player = $("<object class='player'></object>")
        //             .append("<param name='movie' value='"+yurl+"'></param>")
        //             .append("<param name='allowFullScreen' value='true'></param>")
        //             .append("<param name='allowScriptAccess' value='always'></param>")
        //             .append("<param name='autohide' value='1'></param>")
        //             .append("<param name='egm' value='0'></param>")
        //             .append("<param name='rel' value='0'></param>")
        //             .append("<embed class='player' src='"+yurl+"' type='application/x-shockwave-flash' rel='0' allowfullscreen='true' allowscriptaccess='always' egm='0' autohide='1'></embed>");
        // 
        
                
        // ALTERNATIVE PLAYER USES IFRAME TO DISPLAY <video> tag
        // var player = $("<iframe type='text/html' frameborder='0' />")
        //                 .attr('src', url.replace('http://www.youtube.com/v/', 'http://www.youtube.com/embed/'))
                 
        return player;
    },
    
    createVideoBalloon: function(token, url) {
        var player, loader;
        var balloon = $("<div class='balloon video' ></div>");
        
        
        balloon.addClass('token-' + token);
        
        if (url) {
            player = SciHub.createVideoPlayer(url);
            
            balloon.append(player);
        } else {
            loader = $("<div class='loader'></div>");
            loader.append("<img src='loader.gif' />");
            loader.append("<p>Processing...</p>");
            
            balloon.append(loader);
        }
        
        // balloon.mouseover(function() {
        //             $(this).css({width: 360, height: 270});
        //         });
        //         
        //         balloon.mouseout(function() {
        //             $(this).css({width: 240, height: 180});
        //         });
        
        //balloon.addClass('author-'+author.replace(/[^a-z0-9]/i, '-'))
        
        balloon.hide();
        
        var wall_height = $("#wall").height();
        var wall_width = $("#wall").width();
        
        balloon.css('left', (Math.random() * (wall_width - 100) + 'px'));
        balloon.css('top', (Math.random() * (wall_height - 100) + 'px'));
        
        // balloon.dblclick(function() {
        //     expl = $(this).find('.explanation')
        //     if ($(expl).is(':visible'))
        //         $(expl).hide('slide', {direction: 'up', duration: 'fast'})
        //     else
        //         $(expl).show('slide', {direction: 'up', duration: 'fast'})
        // })
        
        $("#wall").append(balloon);
        
        balloon.show('puff', 'fast');
        balloon.mousedown(function() {
            var zs = $('.balloon').map(function() {
                var z = $(this).css('z-index');
                return (z === 'auto') ? 100 : parseInt(z, 10);
            }).toArray();
            var maxZ = Math.max.apply(Math, zs);
            $(this).css('z-index', maxZ + 1);
        });
        
        balloon.draggable();
        
        if (player && player[0]) {
            player[0].loadVideo();
        }
        
        return balloon;
    },
    

    
    events: {
        sail: {

	    got_client_token: function(sev) {
                var token = sev.payload.token;
                
                console.log(token);

                Sail.app.createVideoBalloon(token);
                console.log("video created");
            },
            got_google_client_token: function(sev) {
                var tokenURL = sev.payload.url;
                var token = sev.payload.token;
                
                var nexturl = encodeURI(document.location.href.replace(/\?.*/,'') + '#token='+token);
                $('#submission-form').attr('action', tokenURL+"?nexturl="+nexturl);    
                //$('#submission-form').get(0).setAttribute('action', tokenURL+"?nexturl="+nexturl);
                $('#token-value').val(token);
                console.log(token);
                console.log(tokenURL);
                Sail.app.createVideoBalloon(token);
                console.log("video created");
            },
            
            video_ready: function(sev) {
                var videoReadyURL = sev.payload.url;
                var token = sev.payload.token;
                
                console.log(videoReadyURL);
                $('.token-'+token+' .loader').remove();
                
                var player = SciHub.createVideoPlayer(videoReadyURL);
                $('.token-'+token).append(player);
                player[0].loadVideo();
            }
   
        },
        
        initialized: function(ev) {
            SciHub.authenticate();
        },
        
        connected: function(ev) {
            
            //init VIEW screen
            
            
            $('.upload-screen-button').click(function() {
                var sev = new Sail.Event('video_upload_requested',{});
                SciHub.groupchat.sendEvent(sev);
                //$('#view').hide()
                Sail.UI.showDialog("#add");
                $('#submission-form')
                    .bind('submit', function(){
                        if ($('#file').attr('value')) {
                            $('#submit-upload')
                                .attr('value', "Uploading...")
                                .attr('disabled','disabled');
                            Sail.Strophe.disconnect()
                            return true;
                        } else {
                            alert("Select a file to upload first!")
                            return false;
                        }
                    });
                $('#add .ui-dialog-titlebar-close')
                    .click(function() {Sail.UI.dismissDialog("#add");})
                    .mouseover(function() {$(this).addClass('ui-state-hover');})
                    .mouseout(function() {$(this).removeClass('ui-state-hover');});
            });
            
            $('.upload-screen-button').show('fade');
            

            //init ADD screen
            
            $().sleepyMongo({sleepyUrl:'/mongoose/scihub/videos/'}).find({}, function(data){
                $(data.results).each(function() {
                    Sail.app.createVideoBalloon('', this.url);
                });
            });


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
                Sail.app.createVideoBalloon(token);
                SciHub.groupchat.sendEvent(sev);
            }
            
            
        },        

        authenticated: function(ev) {
                      
        },
        
        logout: function(ev) {
            Sail.app.run = null;
        }
    }    
};
