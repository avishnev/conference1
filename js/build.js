function jstree_build() {
	if ($trig == "1")
	{
		$trig=0;
	}
	else {
//user leaving the room
	        if (data.rslt.obj.attr("users") > 0)
		{
			//self-view is still visible
			if (config.self_view == 1)
			{
			conferenceUI.leaveRoom();
			$.ajax({
			  // ajax call to leave the room
			  url: "topic.php",
			  data: {"tid": data.rslt.obj.attr("id"), "op": "left"}

			}).done( function(msg) {
				console.log("save ", msg);
				jQuery("#list").jstree("refresh",data.rslt.obj.attr("id"));
				$trig=1;
			} )
                        .fail (function (msg) {
				console.log("failed ", msg);
			});
			}
// Join the room
			join_room();
		}
		else
		{
			new_room();
		}
	}
}
