function init()
{
		//define configuration.including test system to run nodejs
                var config = {
			joined:0,
			adPlay: false,
                        self_view:0,
		        rooms: {},
                    openSocket: function(config) {
                        var SIGNALING_SERVER = 'http://ec2-54-211-219-3.compute-1.amazonaws.com:1336/',
                            defaultChannel = location.hash.substr(1) || 'video-conferencing-hangout';

                        var channel = config.channel || defaultChannel;
                        var sender = Math.round(Math.random() * 999999999) + 999999999;
			//nodejs emit signal
                        io.connect(SIGNALING_SERVER).emit('new-channel', {
                            channel: channel,
                            sender: sender
                        });

                        var socket = io.connect(SIGNALING_SERVER + channel);
                        socket.channel = channel;
                        socket.on('connect', function() {
                            if (config.callback) config.callback(socket);
                        });
			//open socket to create room
                        socket.send = function(message) {
                            socket.emit('message', {
                                sender: sender,
                                data: message
                            });
                        };
			var ss = io.connect(SIGNALING_SERVER);
			ss.on('connect', function() {
				console.log('SS On Connect');
                            if (config.callback) config.callback(ss);
                        });

			// register callback functions
                        socket.on('message', config.onmessage);
                        socket.on('commercial', config.oncommercial);
                        ss.on('commercial', config.oncommercial);
                    },
                    onRemoteStream: function(media) {
                        var video = media.video;
			var uid = media.userToken;

                        video.setAttribute('width', 600);
                        video.setAttribute('controls', true);
                        video.setAttribute('id', media.stream.id);
                        video.setAttribute('remote', true);
			//setup commercial play in the container
                        videosContainer.insertBefore(video, videosContainer.firstChild);
			// on creator of conference
			setupAd();
			if (btnSetupNewRoom.disabled) {
			video.onclick = function() {
				this.style.opacity=0;
				this.parentNode.removeChild(this);
				conferenceUI.leaveRoom();
				scaleVideos();
			};
// provide opetions when mouse over the screen
// create popup
			video.onmouseover=function() {
				if (typeof config.popup === "undefined") 
				{
					config.popup = new PopupMenu();
    				config.popup.add('Remove User', function(target){
					target.style.opacity=0;
					target.parentNode.removeChild(target);
					conferenceUI.leaveRoom();
					scaleVideos();
				
				 });
			         config.popup.bind(media.stream.id);
				 }
				 config.popup.show();
			};
// based on the legth umute audio track
// and scale all windowa
                        setTimeout(function() {
                             unmute audio stream for echo-cancellation
                             config.attachStream.getAudioTracks()[0].enabled = true;
                        }, 2000);
                        scaleVideos();
                        video.play();
                    }},
		//if the remote discon
		// delete wind and remove caller
                    onRemoteStreamEnded: function(stream) {
                        var video = document.getElementById(stream.id);
                        if (video) {
                            video.style.opacity = 0;
                            setTimeout(function() {
                                video.parentNode.removeChild(video);
                                scaleVideos();
                            }, 1000);
                        }
                    },
                    onRoomFound: function(room) {
			/announce that room is available
			console.log(room);
                        var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
                        if (alreadyExist) return;

                        if (typeof roomsList === 'undefined') roomsList = document.body;

                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td><strong>' + room.roomName + '</strong> shared a conferencing room with you!</td>' +
                            '<td><button class="join">Join</button></td>';
                        roomsList.insertBefore(tr, roomsList.firstChild);
			// goto empty room
                        var joinRoomButton = tr.querySelector('.join');
                        joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
                        joinRoomButton.setAttribute('data-roomToken', room.roomToken);
                        joinRoomButton.onclick = function() {
                            this.disabled = true;

                            var broadcaster = this.getAttribute('data-broadcaster');
                            var roomToken = this.getAttribute('data-roomToken');
                            captureUserMedia(function() {
                                conferenceUI.joinRoom({
                                    roomToken: roomToken,
                                    joinUser: broadcaster
                                });
                            });
                        };
                    },
// close room & delete
                    onRoomClosed: function(room) {
                        var joinButton = document.querySelector('button[data-roomToken="'+ room.roomToken +'"]');
                        if(joinButton) {
                            // joinButton.parentNode === <li>
                            // joinButton.parentNode.parentNode === <td>
                            // joinButton.parentNode.parentNode.parentNode === <tr>
                            // joinButton.parentNode.parentNode.parentNode.parentNode === <table>
                            joinButton.parentNode.parentNode.parentNode.parentNode.removeChild(joinButton.parentNode.parentNode.parentNode);
                        }
                    },
		    startAd: function(data)
		    {
			//setup commercial and play it on the remote screen
		        if (config.adPlay) 
			{
                	var comm = document.getElementById('advertisement') ;
		      	config.adPlay=false;
			comm.style.opacity=0;
			adContainer.removeChild(comm);
			}
			else {
                    var video = document.createElement('video');
                    video.setAttribute('width', 300);
		    video.src = data;
		    video.id = 'advertisement';
                    video.setAttribute('autoplay', true);
                    video.setAttribute('controls', true);
                    video.setAttribute('remote', false);
                    adContainer.insertBefore(video, adContainer.firstChild);
		    video.play();
		    config.adPlay=true;
  		    }
                }
		};
}

