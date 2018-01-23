function join_room() {
// Join the room
			console.log("Joining room ",$.trim(data.rslt.obj[0].innerText));
                            captureUserMedia(function() {
				console.log("callback function to join room");
				// name the room from user dialog
				config.roomName = $.trim(data.rslt.obj[0].innerText);
				data = config.rooms[config.roomName].split(",");
				config.roomToken = data[0];
				config.broadcaster = data[1];
				config.createdRoom = false;
				config.joinUser=data[1];
				config.adPlay=true;
				// join the room with no ad play

                                conferenceUI.joinRoom( config );
                            });
//ajax method to join th room
			$.ajax({
			  url: "topic.php",
			  data: {"tid": data.rslt.obj.attr("id"), "op": "joined"}

			}).done( function(msg) {

				console.log("save ", msg);
				jQuery("#list").jstree("refresh",data.rslt.obj.attr("id"));
				//show in the tree that people are in  the room
				//refresh jstree to show results.BUG 
				$trig=1;
			} )
                        .fail (function (msg) {
				console.log("failed ", msg);
			});
}
