jquery.form_cookie_store
========================

A plugin based on jQuery, to fullfil the job of store form data in cookie every several seconds automatically.

$.fn.form_cookie_store, based on jQuery
Author: MaxWong
Email: wrymax@qq.com

表单字段自动保存机制，使用cookie
依赖$.cookie插件
Tips:
  1. 关于保存提示：
     1) 如果自己在表单中添加了.auto_save_note和restore_data_note, 插件不会另行添加, 会直接使用用户自定义位置的auto_save_note和restore_data_note
     2) 否则JS将在表单前插入一个.restore_data_note, 在表单尾部插入一个.auto_save_note
     3) 提示的html格式:
        <div class="restore_data_note">
          系统有一些暂存的数据, 需要恢复吗?
          <a href='#' class='restore_data'>恢复</a>
          <a href='#' class='reject_restore_data'>不恢复</a>
        </div>

        <div class='auto_save_wrapper'>
          <span class='saved_note'>已保存!</span>
          <span class='auto_save_note'>
            <span class='counter'>20</span>
            秒后自动保存
          </span>
        </div>

Example: 
  1. Simple invoke: $('form').form_cookie_store()
  2. Custom invoke: 
     $('form#proposal_form').form_cookie_store({
       note_position: {
         auto_save_note: {
           add_type: 'appendTo', 
           rel_node: '#some_id'
          }
         restore_data_note: {
           add_type: 'insertBefore', 
           rel_node: "#some_id"
          }
        }, 
        save_interval: 10000, 
        without_cache: ".class_selector,#id_selector"
     )
