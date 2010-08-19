/*!
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2003 - 2010, EllisLab, Inc.
 * @license		http://expressionengine.com/user_guide/license.html
 * @link		http://expressionengine.com
 * @since		Version 2.0
 * @filesource
 */

EE.publish=EE.publish||{};
EE.publish.category_editor=function(){var d=[],e=$("<div />"),c=$('<div id="cat_modal_container" />').appendTo(e),h={},n={},l=EE.BASE+"&C=admin_content&M=category_editor&group_id=",m,j,a;e.dialog({autoOpen:false,height:450,width:600,modal:true});$(".edit_categories_link").each(function(){var b=this.href.substr(this.href.lastIndexOf("=")+1);$(this).data("gid",b);d.push(b)});for(a=0;a<d.length;a++){h[d[a]]=$("#cat_group_container_"+[d[a]]);h[d[a]].data("gid",d[a]);n[d[a]]=$("#cat_group_container_"+
[d[a]]).find(".cat_action_buttons").remove()}m=function(b){h[b].text("loading...").load(l+b+"&timestamp="+ +new Date+" .pageContents table",function(){j.call(h[b],h[b].html(),false)})};j=function(b,g){var f=$(this),i=f.data("gid");b=$.trim(b);if(f.hasClass("edit_categories_link"))f=$("#cat_group_container_"+i);if(b[0]!=="<"&&g)return m(i);f.closest(".cat_group_container").find("#refresh_categories").show();var k=$(b),p;if(k.find("form").length){c.html(k);k=c.find("input[type=submit]");p=c.find("form");
var q=function(s){var r=s||$(this);s=r.serialize();r=r.attr("action");$.ajax({url:r,type:"POST",data:s,dataType:"html",beforeSend:function(){f.html(EE.lang.loading)},success:function(o){o=$.trim(o);e.dialog("close");if(o[0]=="<"){o=$(o).find(".pageContents table");o.find("form").length==0&&f.html(o);j.call(f,o,true)}else j.call(f,o,true)},error:function(o){e.dialog("close");j.call(f,o.error,true)}});return false};p.submit(q);var t={};t[k.remove().attr("value")]=function(){q(p)};e.dialog("open");e.dialog("option",
"buttons",t);e.one("dialogclose",function(){m(i)})}else n[i].clone().appendTo(f).show();return false};a=function(){var b=$(this).data("gid"),g=".pageContents";if($(this).hasClass("edit_cat_order_trigger")||$(this).hasClass("edit_categories_link"))g+=" table";b||(b=$(this).closest(".cat_group_container").data("gid"));h[b].text(EE.lang.loading);$.ajax({url:this.href+"&timestamp="+ +new Date+g,success:function(f){var i="";f=$.trim(f);if(f[0]=="<"){f=$(f).find(g);i=$("<div />").append(f).html();f.find("form").length==
0&&h[b].html(i)}j.call(h[b],i,true)},error:function(f){f=eval("("+f.responseText+")");h[b].html(f.error);j.call(h[b],f.error,true)}});return false};$(".edit_categories_link").click(a);$(".cat_group_container a:not(.cats_done)").live("click",a);$(".cats_done").live("click",function(){var b=$(this).closest(".cat_group_container");b.text("loading...").load(EE.BASE+"&C=content_publish&M=ajax_update_cat_fields&group_id="+b.data("gid")+"&timestamp="+ +new Date,function(g){b.html($(g).html())});return false})};
var selected_tab="";function get_selected_tab(){return selected_tab}function tab_focus(d){$(".menu_"+d).parent().is(":visible")||$("a.delete_tab[href=#"+d+"]").trigger("click");$(".tab_menu li").removeClass("current");$(".menu_"+d).parent().addClass("current");$(".main_tab").hide();$("#"+d).fadeIn("fast");$(".main_tab").css("z-index","");$("#"+d).css("z-index","5");selected_tab=d;$(".main_tab").sortable("refreshPositions")}EE.tab_focus=tab_focus;
function setup_tabs(){var d="";$(".main_tab").sortable({connectWith:".main_tab",appendTo:"#holder",helper:"clone",forceHelperSize:true,handle:".handle",start:function(e,c){c.item.css("width",$(this).parent().css("width"))},stop:function(e,c){c.item.css("width","100%")}});$(".tab_menu li a").droppable({accept:".field_selector, .publish_field",tolerance:"pointer",forceHelperSize:true,deactivate:function(){clearTimeout(d);$(".tab_menu li").removeClass("highlight_tab")},drop:function(e,c){field_id=c.draggable.attr("id").substring(11);
tab_id=$(this).attr("title").substring(5);$("#hold_field_"+field_id).prependTo("#"+tab_id);$("#hold_field_"+field_id).hide().slideDown();tab_focus(tab_id);return false},over:function(){tab_id=$(this).attr("title").substring(5);$(this).parent().addClass("highlight_tab");d=setTimeout(function(){tab_focus(tab_id);return false},500)},out:function(){d!=""&&clearTimeout(d);$(this).parent().removeClass("highlight_tab")}});$("#holder .main_tab").droppable({accept:".field_selector",tolerance:"pointer",drop:function(e,
c){field_id=c.draggable.attr("id")=="hide_title"||c.draggable.attr("id")=="hide_url_title"?c.draggable.attr("id").substring(5):c.draggable.attr("id").substring(11);tab_id=$(this).attr("id");$("#hold_field_"+field_id).prependTo("#"+tab_id);$("#hold_field_"+field_id).hide().slideDown()}});$(".tab_menu li.content_tab a, #publish_tab_list a.menu_focus").unbind(".publish_tabs").bind("mousedown.publish_tabs",function(e){tab_id=$(this).attr("title").substring(5);tab_focus(tab_id);e.preventDefault()}).bind("click.publish_tabs",
function(){return false})}setup_tabs();
EE.publish.save_layout=function(){var d=0,e={},c={},h=0,n=false,l=$("#tab_menu_tabs li.current").attr("id");$(".main_tab").show();$("#tab_menu_tabs a:not(.add_tab_link)").each(function(){if($(this).parent("li").attr("id")&&$(this).parent("li").attr("id").substring(0,5)=="menu_"){var b=$(this).parent("li").attr("id").substring(5),g=$(this).parent("li").attr("id").substring(5),f=$(this).parent("li").attr("title");h=0;visible=true;if($(this).parent("li").is(":visible")){lay_name=b;e[lay_name]={};e[lay_name]._tab_label=
f}else{n=true;visible=false}$("#"+g).find(".publish_field").each(function(){var i=$(this),k=this.id.replace(/hold_field_/,"");i=Math.round(i.width()/i.parent().width()*10)*10;var p=$("#sub_hold_field_"+k+" .markItUp ul li:eq(2)");p=p.html()!=="undefined"&&p.css("display")!=="none"?true:false;i={visible:$(this).css("display")==="none"||visible===false?false:true,collapse:$("#sub_hold_field_"+k).css("display")==="none"?true:false,htmlbuttons:p,width:i+"%"};if(visible===true){i.index=h;e[lay_name][k]=
i;h+=1}else c[k]=i});visible===true&&d++}});if(n==true){var m,j,a=0;for(darn in e){j=darn;for(m in e[j])if(e[j][m].index>a)a=e[j][m].index;break}$.each(c,function(){this.index=++a});jQuery.extend(e[j],c)}EE.tab_focus(l.replace(/menu_/,""));if(d===0)$.ee_notice(EE.publish.lang.tab_count_zero,{type:"error"});else $("#layout_groups_holder input:checked").length===0?$.ee_notice(EE.publish.lang.no_member_groups,{type:"error"}):$.ajax({type:"POST",dataType:"json",url:EE.BASE+"&C=content_publish&M=save_layout",
data:"XID="+EE.XID+"&json_tab_layout="+JSON.stringify(e)+"&"+$("#layout_groups_holder input").serialize()+"&channel_id="+EE.publish.channel_id,success:function(b){if(b.messageType==="success")$.ee_notice(b.message,{type:"success"});else b.messageType==="failure"&&$.ee_notice(b.message,{type:"error"})}})};
EE.publish.remove_layout=function(){if($("#layout_groups_holder input:checked").length===0)return $.ee_notice(EE.publish.lang.no_member_groups,{type:"error"});$.ajax({type:"POST",url:EE.BASE+"&C=content_publish&M=save_layout",data:"XID="+EE.XID+"&json_tab_layout={}&"+$("#layout_groups_holder input").serialize()+"&channel_id="+EE.publish.channel_id+"&field_group="+EE.publish.field_group,success:function(){$.ee_notice(EE.publish.lang.layout_removed+' <a href="javascript:location=location">'+EE.publish.lang.refresh_layout+
"</a>",{duration:0,type:"success"})}})};EE.date_obj_time=function(){var d=new Date,e=d.getHours();d=d.getMinutes();var c="";if(d<10)d="0"+d;if(EE.date.format=="us")if(e>11){e-=12;c=" PM"}else c=" AM";return" '"+e+":"+d+c+"'"}();file_manager_context="";
function disable_fields(d){var e=$(".main_tab input, .main_tab textarea, .main_tab select, #submit_button"),c=$("#submit_button"),h=$("#holder").find("a");if(d){e.attr("disabled",true);c.addClass("disabled_field");h.addClass("admin_mode");$("#holder div.markItUp, #holder p.spellcheck").each(function(){$(this).before('<div class="cover" style="position:absolute;width:100%;height:50px;z-index:9999;"></div>').css({})})}else{e.removeAttr("disabled");c.removeClass("disabled_field");h.removeClass("admin_mode");
$(".cover").remove()}}function removeAuthor(d){$.get(EE.BASE+"&C=content_publish&M=remove_author",{mid:d.attr("id")});d.parent().fadeOut()}function updateAuthorTable(){$.ajax({type:"POST",url:EE.BASE+"&C=content_publish&M=build_author_table",data:"XID="+EE.XID+"&is_ajax=true",success:function(d){$("#authorsForm").html(d)}});$(".add_author_modal").bind("click",function(){add_authors_sidebar(this)})}
function add_authors_sidebar(d){d=$(d).attr("id").substring(16);$.ajax({type:"POST",url:EE.BASE+"&C=content_publish&M=build_author_sidebar",data:"XID="+EE.XID+"&author_id="+d,success:function(e){$("#author_list_sidebar").append(e).fadeIn();updateAuthorTable()}})}
function liveUrlTitle(){var d=EE.publish.default_entry_title,e=EE.publish.word_separator,c=document.getElementById("title").value||"",h=document.getElementById("url_title"),n=RegExp(e+"{2,}","g"),l=e!=="_"?/\_/g:/\-/g,m="";if(d!=="")if(c.substr(0,d.length)===d)c=c.substr(d.length);c=EE.publish.url_title_prefix+c;c=c.toLowerCase().replace(l,e);for(d=0;d<c.length;d++){l=c.charCodeAt(d);if(l>=32&&l<128)m+=c.charAt(d);else if(l in EE.publish.foreignChars)m+=EE.publish.foreignChars[l]}c=m;c=c.replace("/<(.*?)>/g",
"");c=c.replace(/\s+/g,e);c=c.replace(/\//g,e);c=c.replace(/[^a-z0-9\-\._]/g,"");c=c.replace(/\+/g,e);c=c.replace(n,e);c=c.replace(/^[-_]|[-_]$/g,"");c=c.replace(/\.+$/g,"");if(h)h.value=c.substring(0,75)}
$(document).ready(function(){function d(a){$.get(EE.BASE+"&C=content_publish&M=remove_author",{mid:a.attr("id")});a.parent().fadeOut();$.ajax({type:"POST",url:EE.BASE+"&C=content_publish&M=build_author_table",data:"is_ajax=true"+$("#publishForm").serialize(),success:function(b){$("#authorsForm").html(b);updateAuthorTable()}})}function e(a){if(a){a=a.toString();a=a.replace(/\(\!\(([\s\S]*?)\)\!\)/g,function(b,g){var f=g.split("|!|");return altKey===true?f[1]!==undefined?f[1]:f[0]:f[1]===undefined?
"":f[0]});return a=a.replace(/\[\!\[([\s\S]*?)\]\!\]/g,function(b,g){var f=g.split(":!:");if(j===true)return false;value=prompt(f[0],f[1]?f[1]:"");if(value===null)j=true;return value})}return""}function c(a,b){var g=$("input[name="+b+"]").closest(".publish_field");a.is_image==false?g.find(".file_set").show().find(".filename").html('<img src="'+EE.PATH_CP_GBL_IMG+'default.png" alt="'+EE.PATH_CP_GBL_IMG+'default.png" /><br />'+a.name):g.find(".file_set").show().find(".filename").html('<img src="'+a.thumb+
'" alt="'+a.name+'" /><br />'+a.name);$("input[name="+b+"_hidden]").val(a.name);$("select[name="+b+"_directory]").val(a.directory);$.ee_filebrowser.reset()}var h;$("#layout_group_submit").click(function(){EE.publish.save_layout();return false});$("#layout_group_remove").click(function(){EE.publish.remove_layout();return false});$(".add_author_link").click(function(){$("#add_author_dialog").dialog("open");return false});$("#author_list_sidebar .delete").click(function(){d($(this));return false});$("a.reveal_formatting_buttons").click(function(){$(this).parent().parent().children(".close_container").slideDown();
$(this).hide();return false});$("#write_mode_header .reveal_formatting_buttons").hide();$("#holder").corner("bottom-left");if(EE.publish.smileys==true){$("a.glossary_link").click(function(){$(this).parent().siblings(".glossary_content").slideToggle("fast");$(this).parent().siblings(".smileyContent .spellcheck_content").hide();return false});$("a.smiley_link").toggle(function(){$(this).parent().siblings(".smileyContent").slideDown("fast",function(){$(this).css("display","")})},function(){$(this).parent().siblings(".smileyContent").slideUp("fast")});
$(this).parent().siblings(".glossary_content, .spellcheck_content").hide();$(".glossary_content a").click(function(){var a=$(this).closest(".publish_field"),b=a.attr("id").replace("hold_field_","field_id_");a.find("#"+b).insertAtCursor($(this).attr("title"));return false})}if(EE.publish.autosave){h=function(){var a=$("#tools:visible"),b;a.length===1&&disable_fields(true);b=$("#publishForm").serialize();if(a.length===0){disable_fields(false);$.ajax({type:"POST",url:EE.BASE+"&C=content_publish&M=autosave_entry",
data:b,success:function(g){if(isNaN(g)){if(EE.publish.autosave.error_state=="false"){$.ee_notice(g,{type:"error"});EE.publish.autosave.error_state="true"}}else{if(EE.publish.autosave.error_state=="true")EE.publish.autosave.error_state="false";$.ee_notice(EE.publish.autosave.success,{type:"success"})}}})}};setInterval(h,1E3*EE.publish.autosave.interval)}if(EE.publish.pages){h=$("#pages_uri");var n=EE.publish.pages.pagesUri;h.value||h.val(n);h.focus(function(){this.value===n&&$(this).val("")}).blur(function(){this.value===
""&&$(this).val(n)})}$.ee_filebrowser();var l="";EE.publish.show_write_mode===true&&$("#write_mode_textarea").markItUp(myWritemodeSettings);EE.publish.markitup.fields!==undefined&&$.each(EE.publish.markitup.fields,function(a){$("#"+a).markItUp(mySettings)});write_mode_height=$(window).height()-117;$("#write_mode_writer").css("height",write_mode_height+"px");$("#write_mode_writer textarea").css("height",write_mode_height-67-17+"px");var m=$(".write_mode_trigger").overlay({mask:{color:"#262626",loadSpeed:200,
opacity:0.85},onBeforeLoad:function(){var a=this.getTrigger()[0],b=$("#write_mode_textarea");l=a.id.match(/^id_\d+$/)?"field_"+a.id:a.id.replace(/id_/,"");b.val($("#"+l).val());b.focus()},top:"center",closeOnClick:false});$(".publish_to_field").click(function(){$("#"+l).val($("#write_mode_textarea").val());m.eq(0).overlay().close();return false});$(".closeWindowButton").click(function(){m.eq(0).overlay().close();return false});var j=false;$.ee_filebrowser.add_trigger(".btn_img a, .file_manipulate",
function(a){var b,g="",f="",i="",k="";textareaId=$(this).closest("#markItUpWrite_mode_textarea").length?"write_mode_textarea":$(this).closest(".publish_field").attr("id").replace("hold_field_","field_id_");if(textareaId!=undefined){b=$("#"+textareaId);b.focus()}if(a.is_image){f=EE.upload_directories[a.directory].properties;i=EE.upload_directories[a.directory].pre_format;k=EE.upload_directories[a.directory].post_format;g=EE.filebrowser.image_tag.replace(/\[!\[Link:!:http:\/\/\]!\]/,"");g=g.replace(/src="([^"]*)"/,
'src="$1{filedir_'+a.directory+"}"+a.name+'"');g=g.replace(/\/?>$/,a.dimensions+" "+f+" />");g=i+g+k}else{f=EE.upload_directories[a.directory].file_properties;i=EE.upload_directories[a.directory].file_pre_format;i+='<a href="{filedir_'+a.directory+"}"+a.name+'" '+f+" >";k="</a>";k+=EE.upload_directories[a.directory].file_post_format}if(b.is("textarea")){if(!b.is(".markItUpEditor")){b.markItUp(myNobuttonSettings);b.closest(".markItUpContainer").find(".markItUpHeader").hide();b.focus()}a.is_image?$.markItUp({replaceWith:g}):
$.markItUp({key:"L",name:"Link",openWith:i,closeWith:k,placeHolder:a.name})}else b.val(function(p,q){q+=i+g+k;return e(q)});$.ee_filebrowser.reset()});$("input[type=file]","#publishForm").each(function(){var a=$(this).closest(".publish_field"),b=a.find(".choose_file");$.ee_filebrowser.add_trigger(b,$(this).attr("name"),c);a.find(".remove_file").click(function(){a.find("input[type=hidden]").val("");a.find(".file_set").hide();return false})});$(".hide_field span").click(function(){var a=$(this).parent().parent().attr("id").substr(11),
b=$("#hold_field_"+a);a=$("#sub_hold_field_"+a);if(a.css("display")=="block"){a.slideUp();b.find(".ui-resizable-handle").hide();b.find(".field_collapse").attr("src",EE.THEME_URL+"images/field_collapse.png")}else{a.slideDown();b.find(".ui-resizable-handle").show();b.find(".field_collapse").attr("src",EE.THEME_URL+"images/field_expand.png")}return false});$(".close_upload_bar").toggle(function(){$(this).parent().children(":not(.close_upload_bar)").hide();$(this).children("img").attr("src",EE.THEME_URL+
"publish_plus.png")},function(){$(this).parent().children().show();$(this).children("img").attr("src",EE.THEME_URL+"publish_minus.gif")});$(".ping_toggle_all").toggle(function(){$("input.ping_toggle").each(function(){this.checked=false})},function(){$("input.ping_toggle").each(function(){this.checked=true})});$(".markItUp ul").append('<li class="btn_plus"><a title="'+EE.lang.add_new_html_button+'" href="'+EE.BASE+"&C=myaccount&M=html_buttons&id="+EE.user_id+'">+</a></li>');$(".btn_plus a").click(function(){return confirm(EE.lang.confirm_exit,
"")});$(".markItUpHeader ul").prepend('<li class="close_formatting_buttons"><a href="#"><img width="10" height="10" src="'+EE.THEME_URL+'images/publish_minus.gif" alt="Close Formatting Buttons"/></a></li>');$(".close_formatting_buttons a").toggle(function(){$(this).parent().parent().children(":not(.close_formatting_buttons)").hide();$(this).parent().parent().css("height","13px");$(this).children("img").attr("src",EE.THEME_URL+"images/publish_plus.png")},function(){$(this).parent().parent().children().show();
$(this).parent().parent().css("height","22px");$(this).children("img").attr("src",EE.THEME_URL+"images/publish_minus.gif")});$(".tab_menu li:first").addClass("current");EE.publish.title_focus==true&&$("#title").focus();EE.publish.which=="new"&&$("#title").bind("keyup blur",liveUrlTitle);EE.publish.versioning_enabled=="n"?$("#revision_button").hide():$("#versioning_enabled").click(function(){$(this).attr("checked")?$("#revision_button").show():$("#revision_button").hide()});EE.publish.category_editor()});
