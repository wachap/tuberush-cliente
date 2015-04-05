$(function () {


// Globals

var PATH = "http://localhost:3000";


// AJAX Functions

function getVideo (url, callback) {
	$.ajax({
		data: {
			url: url
		},
		url: PATH+"/urls/",
		error: onError
	})
	.done( callback );
};


// Template Functions

function videoTemplate (video) {
	var html = '',
		v360p = video.links.mp4.v360p,
		v480p = video.links.mp4.v480p,
		v720p = video.links.mp4.v720p;

	html += '<div class="video"><iframe width="854" height="510" src="https://www.youtube.com/embed/'+video.id+'" frameborder="0" allowfullscreen></iframe></div>';
	html += '<ul class="Links">';
	if (v360p !=null)
		html += '<li class="Link-option"><a href="'+v360p+'" download class="link btn-succes btn-lg">360p</a></li>'
	if (v480p !=null)
		html += '<li class="Link-option"><a href="'+v480p+'" download class="link btn-succes btn-lg">480p</a></li>'
	if (v720p !=null)
		html += '<li class="Link-option"><a href="'+v720p+'" download class="link btn-succes btn-lg">720p</a></li>'
	html += '</ul>';

	return html
};


var $videoInput = $('#youtube-url');
var $button = $('#youtube-button');
var $resultOut = $('#result');

$videoInput.on('keyup', onKeyUp);
$button.on('click', onSubmit);

var $videoTitle = $('.MainSection-title');

function onKeyUp (evt) {
	if (evt.keyCode == 13) {
		onSubmit();
	};
};

function onSubmit () {
	getVideo($videoInput.val(), fillVideoInfo);
	NProgress.start();
	$resultOut.html( '<p class="loading">cargando...</p>' );
};

function onError() {
	NProgress.done();
	$resultOut.html( '<p class="error">Error... :(</p>' );
}

// Fill Functions

function fillVideoInfo (jsonData) {
	if (jsonData.video.success == false || jsonData.error || !jsonData) {
		return onError();
	};

	var videoTitle = jsonData.video.title;
	$videoTitle.html(videoTitle);

	var html = videoTemplate(jsonData.video);
	$resultOut.html(html);
	NProgress.done();
};


});

