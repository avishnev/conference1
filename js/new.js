function new_room() {
			//create new room
			//room retrived from user 
			console.log("Starting room ",$.trim(data.rslt.obj[0].innerText));
	                config.createdRoom=true;
			openNewRoom( $.trim(data.rslt.obj[0].innerText));
			// Ajax to open new conf room
			$.ajax({
			  url: "topic.php",
			  data: {"tid": data.rslt.obj.attr("id"), "op": "joined"}

			}).done( function(msg) {
				console.log("save ", msg);
				jQuery("#list").jstree("refresh",data.rslt.obj.attr("id"));
				$trig=1;
			} )
                        .fail (function (msg) {
				console.log("failed ", msg);
			});
}
