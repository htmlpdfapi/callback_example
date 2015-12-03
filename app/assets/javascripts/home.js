$(function(){

	var timer;

	function check(){
		var id = getCookie('file_id');
		$.get('/check/'+id).done(function(data){
			if(data.status == 'Done'){
				deleteCookie('file_id');
				stopChecking();
				// redirect or show message with link to pdf file
				// window.location = data.url;
				showDownloadMessage(data.url);
			}
		});
	}

	function startChecking(){
		$('#notice').html('');
		$('.generate-pdf span').text('PDF is generating');
		$('.generate-pdf').addClass('ajax');
		$('.generate-about').show();
		timer = setInterval(check, 2000);
	}

	function stopChecking(){
		$('.generate-pdf span').text('Generate PDF');
		$('.generate-pdf').removeClass('ajax');
		$('.generate-about').hide();
		clearInterval(timer);
	}

	function showDownloadMessage(url){
		var text  = [
			'<span class="pdf">',
			'<a class="btn btn-success" href="'+ url +'" target="_blank">Download 20 top reated movies</a>',
			'</span>'
		];
		$('#notice').html(text.join(''));
	}

	function deleteCookie( name ) {
	  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	function getCookie(name) {
	  var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
	  var result = regexp.exec(document.cookie);
	  return (result === null) ? null : result[1];
	}
	
	// if cookie exists start checking
  if(getCookie('file_id')){
  	startChecking();
  }

  // start checking on click
	$('.generate-pdf').on('click', function(e){
		e.preventDefault();
		var $this = $(this);

		if($this.hasClass('ajax')){ return; }

		$.post('/generate_pdf').done(function(data){
			startChecking();
		});
	});

	// show message to user
	$('.container').on('click', '#notice a', function(e){
  	$('#notice').html('');
  });

	// prevent user to change page
	$('.nav a').on('click', function(e){
		if($('#notice').html()){
			e.preventDefault();
			alert('You have new download content available.\nDownload it to continue.');
		}
	});

	// show alert on refresh
	window.onbeforeunload = function() {
		if($('#notice').html()){
    	return "You have new download content available.\nDownload it or you will loose it.";
  	}
  };

});
