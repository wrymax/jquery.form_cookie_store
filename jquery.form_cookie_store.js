/*
# $.fn.form_cookie_store, based on jQuery
# Author: MaxWong
# Email: wrymax@qq.com
#
# 表单字段自动保存机制，使用cookie
# 依赖$.cookie插件
# Tips:
#   1. 关于保存提示：
#      1) 如果自己在表单中添加了.auto_save_note和restore_data_note, 插件不会另行添加, 会直接使用用户自定义位置的auto_save_note和restore_data_note
#      2) 否则JS将在表单前插入一个.restore_data_note, 在表单尾部插入一个.auto_save_note
#      3) 提示的html格式:
#         <div class="restore_data_note">
#           系统有一些暂存的数据, 需要恢复吗?
#           <a href='#' class='restore_data'>恢复</a>
#           <a href='#' class='reject_restore_data'>不恢复</a>
#         </div>
#
#         <div class='auto_save_wrapper'>
#           <span class='saved_note'>已保存!</span>
#           <span class='auto_save_note'>
#             <span class='counter'>20</span>
#             秒后自动保存
#           </span>
#         </div>
#
# Example: 
#   1. Simple invoke: $('form').form_cookie_store()
#   2. Custom invoke: 
#      $('form#proposal_form').form_cookie_store({
#        note_position: {
#          auto_save_note: {
#            add_type: 'appendTo', 
#            rel_node: '#some_id'
#           }
#          restore_data_note: {
#            add_type: 'insertBefore', 
#            rel_node: "#some_id"
#           }
#         }, 
#         save_interval: 10000, 
#         without_cache: ".class_selector,#id_selector"
#      )
#   
#
*/
$.fn.form_cookie_store = function(_config) {
  var auto_save_note, bind_function, clear_all_cookie, clear_cookie, column, config, cookie_data, count, default_config, is_empty, make_restore_note, make_saved_note, not_bind_flag, restore_data_note, saved_note, segments, that, write_cookie, _c_val, _i, _len;
  that = $(this);
  _config || (_config = {});
  default_config = {
    note_position: {
      auto_save_note: {
        add_type: 'appendTo',
        rel_node: "#" + (that.attr('id'))
      },
      restore_data_note: {
        add_type: 'insertBefore',
        rel_node: "#" + (that.attr('id'))
      }
    },
    save_interval: 20000,
    without_cache: null,
    with_cache_default: '.no_cookie_store,[type=hidden]'
  };
  config = $.extend({}, default_config, _config);
  if (config.without_cache) {
    config.with_cache = $.map(['textarea', 'input', 'select'], function(elem) {
      return "" + elem + ":not(" + (config.without_cache + ',' + config.with_cache_default) + ")";
    }).join(',');
  } else {
    config.with_cache = $.map(['textarea', 'input', 'select'], function(elem) {
      return "" + elem + ":not(" + config.with_cache_default + ")";
    }).join(',');
  }
  is_empty = function(obj) {
    var column, value;
    for (column in obj) {
      value = obj[column];
      return false;
    }
    return true;
  };
  write_cookie = function(name, value, expires) {
    var _cookie;
    expires = expires || 1;
    _cookie = $.cookie(name) ? $.cookie(name) : "";
    return $.cookie(name, value, {
      'expires': expires,
      'path': '/'
    });
  };
  clear_cookie = function(name) {
    return $.cookie(name, null, {
      'path': '/'
    });
  };
  segments = [];
  that.find(config.with_cache).each(function() {
    if (this.id.length) {
      return segments.push(this.id);
    } else {
      this.id = "cookie_store_" + this.name;
      return segments.push(this.id);
    }
  });
  clear_all_cookie = function() {
    var column, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      column = segments[_i];
      _results.push(clear_cookie(column));
    }
    return _results;
  };
  make_restore_note = function() {
    var div;
    if ($('.restore_data_note').size()) {
      return $('.restore_data_note');
    } else {
      div = $("<div class='restore_data_note' style='display:none'>系统有一些暂存的数据，需要恢复吗？" + "<a href='#' class='restore_data'>恢复</a><a href='#' class='reject_restore_data'>不恢复</a></div>");
      eval("div." + config.note_position.restore_data_note.add_type + "($('" + config.note_position.restore_data_note.rel_node + "'))");
      return div;
    }
  };
  restore_data_note = make_restore_note();
  cookie_data = {};
  for (_i = 0, _len = segments.length; _i < _len; _i++) {
    column = segments[_i];
    if (_c_val = $.cookie(column)) {
      cookie_data[column] = _c_val;
    }
  }
  cookie_data = cookie_data;
  if (!is_empty(cookie_data)) {
    restore_data_note.show();
    restore_data_note.find('a.restore_data').click(function() {
      var data;
      for (column in cookie_data) {
        data = cookie_data[column];
        $('#' + column).val(data).effect('highlight', 1000);
      }
      that.find('select.data').trigger('change');
      restore_data_note.slideToggle('fast');
      clear_all_cookie();
      return false;
    });
    restore_data_note.find('a.reject_restore_data').click(function() {
      restore_data_note.slideToggle('fast');
      clear_all_cookie();
      return false;
    });
  }
  make_saved_note = function() {
    var div;
    if ($('.auto_save_wrapper').size()) {
      $('.auto_save_note').find('.counter').text(config.save_interval / 1000);
      return $('.auto_save_note');
    } else {
      div = $("<div class='auto_save_wrapper' style='display:none'><span class='saved_note'>已保存!</span><span class='auto_save_note' style='display:block'><span class='counter'>" + (config.save_interval / 1000) + "</span>秒后自动保存</span></div>");
      eval("div." + config.note_position.auto_save_note.add_type + "($('" + config.note_position.auto_save_note.rel_node + "'))");
      return div;
    }
  };
  auto_save_note = make_saved_note();
  saved_note = $('span.saved_note');
  count = $('.counter');
  not_bind_flag = true;
  bind_function = function() {
    var handler1, handler2;
    if (not_bind_flag) {
      handler1 = setInterval(function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = segments.length; _j < _len1; _j++) {
          column = segments[_j];
          _results.push(write_cookie(column, $('#' + column).val(), 1));
        }
        return _results;
      }, config.save_interval);
      handler2 = setInterval(function() {
        var current_count;
        current_count = parseInt(count.text());
        if (current_count > 0) {
          count.text(current_count - 1);
          if (current_count === config.save_interval / 1000 - 2) {
            return saved_note.hide();
          }
        } else {
          count.text(config.save_interval / 1000);
          return saved_note.show();
        }
      }, 1000);
      that.find('input.submit').click(function() {
        return clear_all_cookie();
      });
      auto_save_note.show();
      return not_bind_flag = false;
    }
  };
  that.find('input:not([type=submit]),textarea').keyup(bind_function);
  that.find('select').change(bind_function);
  return $(this);
};
