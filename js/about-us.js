var Favourite = function(opts) {
  var scope = this;
  var url = window.location.hostname == 'www.bpl-digital.com' ? 'https://new.barpass.co.uk' : 'https://staging.barpass.co.uk';

  scope.el = $('#favourite-items');

  scope.init = function() {
    if (scope.el.length == 0) return;
    scope.fetchFavourites(scope.onFavouritesFetched);
  };

  scope.fetchFavourites = function(cb) {
    $.get(url + '/api/website/favourites.json', cb).fail(scope.onFailedRequest);
  };

  scope.onFavouritesFetched = function(data) {
    scope.el.empty();
    if (data && data.length > 0) {
      $.each(data, function(_, favourite) {
        scope.renderFavourite(favourite);
      });
    }
  };

  scope.renderFavourite = function(favourite) {
    scope.loadTmpl('favourite-item-template', favourite, function(html) {
      scope.el.fadeOut(function() {
        scope.el.append(html).fadeIn('slow');

      });
    });
  };

  this.loadTmpl = function(tmplId, context, cb) {
    if (typeof(context) === 'undefined') context = {};
    var source   = $("#" + tmplId).html();
    var template = Handlebars.compile(source);
    var html = template(context);
    cb(html);
  };

  scope.onFailedRequest = function(xhr) {
    console.log(xhr.responseText);
    scope.onFavouritesFetched({items: []});
  };
};

Handlebars.registerHelper('hideUrlProtocol', function(url) {
  return url.replace(/.*?:\/\//g, '');
});

var onReady = function() {
  if (window.innerHeight < 530) {
    $('.cover .page-title').css('height', '150px');
  }
  var favourite = new Favourite();
  favourite.init();
};

$(document).ready(onReady);
$(document).on('page:load', onReady);
