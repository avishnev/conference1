<?php   
	connectdb();
	$count=0;
	if (isset ($_GET['tid']))
	{
		if ($_GET['op'] == "joined")
		{
			updateUser($_GET['tid'],1);
			return(1);
		}
		if ($_GET['op'] == "left")
		{
			updateUser($_GET['tid'],-1);
			return(1);
		}
	}
	else
	{
		//Pull data from db and format icons
		$data = getTopics();

		$return = array(
			'data' => 'Conversation topics',
			'children' => $data,
			'state' => 'open'
		);
	      
		$return = json_encode($return);
	}

function getTopics()
{
    global $count;
    $sql = 'SELECT * FROM topics ';
    
    $result = mysql_query($sql); // result set
    
    while($rec = mysql_fetch_array($result, MYSQL_ASSOC)){
	$n = $rec["name"];
	$u = $rec["users"];
	if ($rec["paid"] == "1")
		$arr[$count]["data"] = "<table><tr><td> <span class=\"ui-button-icon-primary ui-icon silk-icon-money-dollar\" style=\"display: inline-block;\"></td><td>$n</td><td>$u</td></tr></table>";
	else
		$arr[$count]["data"] = "<table><tr><td style=\"height:30px\"> <span class=\"ui-button-icon-primary ui-icon silk-icon-accept\" style=\"display: inline-block;\"></td><td>$n</td><td>$u</td></tr></table>";
	//if paid topic
	if ($rec["paid"] == "1")
		$arr[$count]["data"] = "<span class=\"ui-button-icon-primary ui-icon silk-icon-money-dollar\" style=\"display: inline-block;\"></span>$n";
	else
		$arr[$count]["data"] = "<span class=\"ui-button-icon-primary ui-icon silk-icon-accept\" style=\"display: inline-block;\"></span>$n";

	if ($u > 0)
	{
		$act = "<span class=\"ui-button-icon-primary ui-icon silk-icon-user-green\" style=\"display: inline-block; position:fixed;left:300px;\"><span class=\"ui-button-icon-primary ui-icon silk-icon-user-green\" style=\"display: inline-block; position:fixed;left:310px;\"></span>";
	}
	else
	{
		$act = "";
	}

	$prev = $arr[$count]["data"];
	$arr[$count]["data"] = "$prev $act";
	$arr[$count]["attr"]["id"] = $rec["id"];
	$arr[$count]["attr"]["started"] = $rec["started"];
	$arr[$count]["attr"]["users"] = $rec["users"];
	$arr[$count]["attr"]["paid"] = $rec["paid"];
	if ($rec["description"] == null)
	{
		$arr[$count]["attr"]["desription"] = "N/A";
	}
	else {
		$arr[$count]["attr"]["description"] = $rec["description"];
	}
	$count++;
    };
    $arr[$count]="";
	$count++;

    return json_encode($arr);  //encode the data in json format
}
// update # of users fro db
function updateUser ($id, $num)
{
    $sql = "update topics set users=users+$num where id=$id";
    $result = mysql_query($sql); 
}
?>
