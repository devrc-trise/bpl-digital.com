$(document).ready(function() {
  if (window.innerHeight < 530) {
    $('.cover .page-title').css('height', '150px');
  }

  var favouriteSection = $('section#favourite');
  if (favouriteSection.length) {
      var apiUrl = window.location.hostname == 'www.bpl-digital.com' ? 'https://new.barpass.co.uk' : 'http://localhost:3000';
      $.get(apiUrl + '/api/website/favourites.json', function(data) {
        console.log(data);
      });
  }
});

