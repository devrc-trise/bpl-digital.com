var BlogPost = function (opts) {
  var scope = this;
  var blogId = opts.blogId;
  var postId = opts.postId;
  var prevId = null;
  var nextId = null;
  var key = opts.key;
  var url = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId + '/posts/' + postId;

  scope.el = $('#blog-item');
  scope.navigationEl = $('#blogpost-navigation');

  scope.init = function () {
    if (scope.el.length == 0) return;
    scope.fetchPost(scope.onPostFetched);
    scope.initPostNav();
    scope.initShareBtns();
  };

  scope.initShareBtns = function () {
    var twitterhref = "https://twitter.com/intent/tweet?" +
               $.param({text:"Great article from " + window.location.origin + "/blogpost.html?postID=" + postId});
    var gplushref = "https://plus.google.com/share?" +
                    $.param({url: window.location.origin + "/blogpost.html?postID=" + postId});
    $('a.twitter-share-button').attr('href', twitterhref);
    $('a.gplus-share-button').attr('href', gplushref);
  };

  scope.fetchPost = function (cb) {
    $.get(url + '?key=' + key, cb).fail(scope.onFailedRequest);
  };

  scope.initPostNav = function () {
    var blog = new Blog({blogId: blogId, key: key});
    blog.fetchPosts(scope.setPostNav);
  };

  scope.setPostNav = function (data) {
    var posts = data.items;
    var prev, next;
    $.each(posts, function (idx, post) {
      if (post.id == postId) {
        prev = posts[idx - 1];
        next = posts[idx + 1];
      }
    });
    scope.setPrev(prev);
    scope.setNext(next);
  };

  scope.setPrev = function (prev) {
    if (prev) {
      scope.navigationEl.find('.prev-post').attr('href', 'blogpost.html?postID=' + prev.id)
        .removeClass('disabled');
    }
  };

  scope.setNext = function (next) {
    if (next) {
      scope.navigationEl.find('.next-post').attr('href', 'blogpost.html?postID=' + next.id)
        .removeClass('disabled');
    }
  };

  scope.onPostFetched = function (data) {
    console.log(data);
    scope.renderPost(data);
    scope.renderComments();
  };

  scope.renderComments = function () {
    $('#loading-comments').show();
    $('#blogpost-comments').hide();
    setTimeout(function () {
      $('#blogpost-comments').show();
      $('#loading-comments').hide();
      $('#blogpost-comments form').prepend('<h5><strong>LEAVE A COMMENT</strong></h5>');
      $('#blogpost-comments form input[type="submit"]').addClass('btn-primary');
      $('#HCB_comment_box > h3').append(' : ' + $('#comments_list .comment').length);
      $('#comments_list .comment').prepend('<div class="arrow">◀</div>');
      $('#comments_list .hcb-comment-tb').remove();
      var commentEl = $('#comments_list .comment');
      $.each(commentEl, function (_, el) {
        var authorEl = $(el).find('.author');
        var dateEl = $(el).find('.date');
        authorEl.css({'float':'left', 'padding-right':'5px'});
        if (authorEl.html()) authorEl.html(authorEl.html().replace(' said:', ' |'));
        if (dateEl.html()) dateEl.html(dateEl.html().replace('(', '').replace(')', ''));
      });
      $('#blogpost-comments form input[type="submit"]').on('click', function () {
        setTimeout(function () { window.location.reload(); }, 500);
      });
    }, 3000);
  };

  scope.renderPost = function (post) {
    scope.loadTmpl('blog-item-template', post, function (html) {
      scope.el.fadeOut(function () {
        scope.el.empty();
        scope.el.append(html).fadeIn('slow');
      })
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
  };
};

Handlebars.registerHelper('formatDate', function (datetime) {
  return moment(datetime).format('LL');
});

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
         var pair = vars[i].split("=");
         if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

var onReady = function () {
  var postID = getQueryVariable('postID');
  var post = new BlogPost({
    blogId: '6480478910731184161',
    postId: postID,
    key: 'AIzaSyD3AXPYWquSg9UpnbsE_6wxzsAPpPe7Irc'
  });
  post.init();
};

$(document).ready(onReady);
$(document).on('page:load', onReady);