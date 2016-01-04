$(function () {

// Globals
var PATH = "http://tuberush.herokuapp.com";

// Sockets
var socket = io.connect(PATH);

socket.on('sendVideo', function (data) {
	data = JSON.parse(data);
	fillNewVideo(data);
});

// AJAX Functions
function getLastVideos (callback) {
	$.ajax({
		url: PATH+"/videos"
	})
	.done( callback );
};

function getVideo (url, callback) {
	$.ajax({
		data: {
			url: url
		},
		url: PATH+"/videos/url",
		error: onError
	})
	.done( callback );
};

// Variables
var $videoInput = $('#youtube-url');
var $button = $('#youtube-button');
var $resultOut = $('#result');
var $lastVideo = $('#lastVideos');
var $lastVideosResultOut = $('#lastVideos');

// Event Listeners
$(document).on('ready', onReady);
$videoInput.on('keyup', onKeyUp);
$button.on('click', onSubmit);
$lastVideo.on('click', 'li', onClickVideo);

// Event Functions
function onClickVideo (datos) {	
	datos.preventDefault();
	$videoInput.val(datos.currentTarget.children[0].href);
	onSubmit();
};

function onReady () {
	getLastVideos(fillLastVideos);	
};

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
};

// Fill Functions
function fillVideoInfo (jsonData) {
	if (jsonData.video.success == false || jsonData.error || !jsonData) {
		return onError();
	};

	var html = videoTemplate(jsonData.video);
	$resultOut.html(html);
	NProgress.done();
	
	socket.emit('newVideo', {id: jsonData.video.id || null});
};

function fillNewVideo (jsonData) {	
	var html = newVideoTemplate(jsonData.videos);	
	$lastVideosResultOut.prepend(html);
};

function fillLastVideos (jsonData) {
	var videos = jsonData.videos;

	$(videos).each(function (i) {
		var html = newVideoTemplate(videos[i]);
		$lastVideosResultOut.prepend(html);
	});	
};

// Templates Functions
function videoTemplate (video) {
	var html = '',
		v360p = video.links.mp4.v360p,
		v480p = video.links.mp4.v480p,
		v720p = video.links.mp4.v720p;
		a128p = video.links.mp3.a128p;

	html += '<h1>'+video.title+'</h1>'
	html += '<div class="video-wrapper"><div class="video"><iframe width="640" height="360" src="https://www.youtube.com/embed/'+video.id+'" frameborder="0" allowfullscreen></iframe></div></div>';
	html += '<ul class="Links">';
	if (v360p !=null)
		html += '<li class="Link-option"><a href="'+v360p+'" download="'+video.title+' 360p.mp4" class="link btn-succes btn-lg">360p</a></li>'
	if (v480p !=null)
		html += '<li class="Link-option"><a href="'+v480p+'" download="'+video.title+' 480p.mp4" class="link btn-succes btn-lg">480p</a></li>'
	if (v720p !=null)
		html += '<li class="Link-option"><a href="'+v720p+'" download="'+video.title+' 720p.mp4" class="link btn-succes btn-lg">720p</a></li>'
	if (a128p !=null)
		html += '<li class="Link-option"><a href="'+a128p+'" download="'+video.title+'.m4a" class="link btn-succes btn-lg">audio mp4</a></li>'
	html += '</ul>';

	return html
};

function newVideoTemplate (video) {
	var html = '';
	html += '<li><a href="'+video.url+'"><img src="'+video.thumbnail_url+'" alt="'+video.title+'"></a></li>';
	return html;
};

});

