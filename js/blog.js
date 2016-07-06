var Blog = function (opts) {
  var scope = this;
  var blogId = opts.blogId;
  var key = opts.key;
  var url = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId;

  scope.el = $('#blog-items');

  scope.init = function () {
    if (scope.el.length == 0) return;
    scope.fetchPosts(scope.onPostsFetched);
  };

  scope.fetchPosts = function (cb) {
    $.get(url + '/posts?key=' + key, cb).fail(scope.onFailedRequest);
  };

  scope.onPostsFetched = function (data) {
    scope.el.empty();
    if (data.items && data.items.length > 0) {
      $.each(data.items, function (_, post) {
        scope.renderPost(post);
      });
    } else {
      scope.el.append('<h1>No blog posts available.</h1>');
    }
  };

  scope.renderPost = function (post) {
    scope.loadTmpl('blog-item-template', post, function (html) {
      scope.el.fadeOut(function () {
        scope.el.append(html).fadeIn('slow');
      });
    });
  };

  this.loadTmpl = function (tmplId, context, cb) {
    if (typeof(context) === 'undefined') context = {};
    var source   = $("#" + tmplId).html();
    var template = Handlebars.compile(source);
    var html = template(context);
    cb(html);
  };

  scope.onFailedRequest = function(xhr) {
    console.log(xhr.responseText);
    scope.onPostsFetched({items: []});
  };
};

Handlebars.registerHelper('formatDate', function (datetime) {
  return moment(datetime).format('LL');
});

Handlebars.registerHelper('textOnly', function (html) {
  return $('<div>').html(html).text().replace(/\s/g, ' ');
});

Handlebars.registerHelper('firstImage', function (html) {
  var tmpEl = $('<div>').html(html);
  var img = tmpEl.find('img')[0];
  if (img) {
    return img.src;
  } else {
    return "img/no_photo_available.png";
  }
});

Handlebars.registerHelper('getOrigin', function () {
  return encodeURIComponent(window.location.origin);
});

var onReady = function () {
  var blog = new Blog({
    blogId: '2280572607293321562',
    key: 'AIzaSyCbUWEsc9qUoQduxztlAmY2qwK1doFZq3M'
  });
  blog.init();
};

$(document).ready(onReady);
$(document).on('page:load', onReady);