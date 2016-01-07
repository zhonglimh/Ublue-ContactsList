/*!
* Ublue ContactsList v1.0
* Simulated IOS(iPhone) Alphabetical Contact List
*
* Copyright (c) 2015 梦幻神化 - http://www.bluesdream.com
* Licensed under the MIT License - 请保留此信息，如果您有修改或意见可通过网站给我留言。
*
* Create: 2015.11.30
*/
;(function($,window,document,undefined){
	$.fn.ublue_ContactsList = function(options) {
		var contacts 		= $(this),
			contactsElems 	= [];

		var opts = $.extend({
			contactsHeader:'.contacts-header',
			contactsContent:'.contacts-content',
			group:'.contacts-group',
			groupHeader:'.contacts-group-hd',
			groupNav:'.contacts-nav'
		}, opts);

		// 获取header高度
		var $tmp_headerHeight 	= $(opts.contactsHeader).outerHeight();
		// 相关参数存入数组
		contacts.find(opts.group).each(function(index, elem) {
			var $tmp_list 			= $(this),
				$tmp_listHeight 	= $(this).height(),
				$tmp_listOffset 	= $(this).position().top;
			contactsElems.push({
				'headerText': $(this).find(opts.groupHeader).text().toLowerCase(),
				'headerHeight': $tmp_headerHeight,
				'list': $tmp_list,
				'listHeight': $tmp_listHeight,
				'listOffset': $tmp_listOffset,
				'listBottom': $tmp_listHeight + $tmp_listOffset
			});
		});
		$(opts.contactsHeader).text( contactsElems[0].headerText );

		// 滚动函数
		function scroll(currentTop){
			var topElement, offscreenElement, topElementBottom, i = 0;
			
			while ( (contactsElems[i].listOffset - currentTop) <= 0 ) {
				topElement = contactsElems[i];
				topElementBottom = topElement.listBottom - currentTop;
				if ( topElementBottom < -topElement.headerHeight ) {
					offscreenElement = topElement;
				}
				i++;
				if ( i >= topElement.length ) {
					break;
				}
			}

			if (topElementBottom < 0 && topElementBottom > -topElement.headerHeight) {
				$(opts.contactsHeader).addClass('isHidden');
				$(topElement.list).addClass('isAnimated');
			}else{
				$(opts.contactsHeader).removeClass('isHidden');
				if (topElement) {
					$(topElement.list).removeClass('isAnimated');
				}
			}

			if (topElement) {
				$(opts.contactsHeader).text(topElement.headerText);
			}
		}
		// 当前位置
		function currentLocation(x, y) {
			$(opts.groupNav).find('li').each(function() {
				if (!(
					x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
					y <= $(this).offset().top || y >= $(this).offset().top + $(this).outerHeight()
				)) {
					var elemId 		= currentIndex( $(this).attr('alt') );
					var elemTop 	= contactsElems[elemId].listOffset;
					$(opts.contactsContent).stop().animate({scrollTop: elemTop},0);
				}
			});
		}
		// 当前索引
		function currentIndex(val){
			for ( var i = 0; i < contactsElems.length; i++){
				if ( contactsElems[i].headerText == val ){
					return i
				}
			}
		}

		// 列表滑动定位
		$(opts.contactsContent).scroll(function(e) {
			e.stopPropagation();
			scroll($(this).scrollTop())
		});

		// 首字母滑动索引
		document.querySelector(opts.groupNav).addEventListener('touchmove', function(e) {
			var touch 	= e.changedTouches[0],
				elem 	= document.elementFromPoint(touch.pageX, touch.pageY);
			if ( elem && elem.nodeName == "LI" ) {
				currentLocation(touch.clientX, touch.clientY);
			}
		});

		// 禁止浏览器默认事件的同时，防止影响内部滚动
		var overScroll = function(el) {
			el.addEventListener('touchstart', function() {
				var top = el.scrollTop,
					totalScroll = el.scrollHeight,
					currentScroll = top + el.offsetHeight
				// 当我们滚动到容器顶部或底部时，向上或向下移动1个像素，阻止整体页面滚动。
				if (top === 0) {
					el.scrollTop = 1;
				} else if (currentScroll === totalScroll) {
					el.scrollTop = top - 1;
				}
			});
			el.addEventListener('touchmove', function(e) {
				// 内容溢出时，才可以允许滚动
				if (el.offsetHeight < el.scrollHeight);
					e._isScroller = true;
			});
		};
		overScroll( document.querySelector(opts.contactsContent) );
		// 禁止IOS页面弹性滚动
		document.addEventListener('touchmove', function(e) {
			if (!e._isScroller) {
				e.preventDefault();
			};
		});
	};
})(jQuery,window,document);