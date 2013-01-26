
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Write your app here.


    function formatDate(d) {
        return (d.getMonth()+1) + '/' +
            d.getDate() + '/' +
            d.getFullYear();
    }
// Match a Youtube url pattern
    var YOUTUBE = /youtube\.com(?:\/#)?\/watch\?v=([A-Z0-9-_]+)|youtu\.be\/([A-Z0-9-_]+)/i;
    var VIMEO = /vimeo.com\/([A-Z0-9-_]+)/i;

    function generateVideo(url) {
      var match_vimeo= url.match(VIMEO);
      var match_youtube = url.match(YOUTUBE);

      // If a url pattern is matched, return the iframe - otherwise, return the string
      if (match_youtube) {
        var youtubeId = match_youtube[1]?match_youtube[1]:match_youtube[2];
        url = '<div class="video-wrapper"><iframe width="560" height="349" ' +
          'src="http://www.youtube.com/embed/' + youtubeId +
          '?wmode=transparent" frameborder="0" allowfullscreen></iframe></div>'
      }else if (match_vimeo) {
        url = '<div class="video-wrapper"><iframe src="http://player.vimeo.com/video/'+ match_vimeo[1]+ '?title=0&amp;byline=0" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>';
      }
      return (url);
    }

    // List view

    var list = $('.list').get(0);
    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
      $('.title', this).html(generateVideo(item.get('title')));
      $('.desc', this).html(item.get('desc'));
      $('.date', this).text(formatDate(item.get('date')));
    };

    // Edit view

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        item = item || { id: '', get: function() { return ''; } };

        $('input[name=id]', this).val(item.id);
        $('input[name=title]', this).val(item.get('title'));
        $('input[name=desc]', this).val(item.get('desc'));
    };

    edit.getTitle = function() {
        var model = this.view.model;

        if(model) {
            return model.get('title');
        }
        else {
            return 'New';
        }
    };

    $('button.add', edit).click(function() {
        var el = $(edit);
        var title = el.find('input[name=title]');
        var desc = el.find('input[name=desc]');
        var model = edit.model;

        if(model) {
            model.set({ title: title.val(), desc: desc.val() });
        }
        else {
            list.add({ title: title.val(),
                       desc: desc.val(),
                       date: new Date() });
        }

        edit.close();
    });
});
