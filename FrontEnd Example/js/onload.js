$( document ).ready(function()
{
	$('#tabAll').click(function()
	{
		$('#tabAll').addClass('in active'); 

		$('.tab-pane').each(function(i,t)
		{
			$('#myTabs li').removeClass('in active'); 		

			$(this).addClass('in active');   

			var j;
			for(j = 1; j <= 7; j++)
			{
				console.log("Modificando " + '#dvtb' + j);
				$('#dvtb' + j).removeClass(); 		
				$('#dvtb' + j).addClass('col-sm-6 col-sm-offset-3'); 
			}
		});

	});

	var i;
	for(i = 0; i <= 7; i++)
	{
		$('#tb' + i).click(function()
		{
			var j;
			for(j = 1; j <= 7; j++)
			{
				console.log("Modificando " + '#dvtb' + j);
				$('#dvtb' + j).removeClass(); 		
				$('#dvtb' + j).addClass('col-sm-8 col-sm-offset-2'); 
			}
		});
	}

});

window.onload = function() {
  createMyLine2()
};
