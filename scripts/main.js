var app = {
    // User Data (to store campagin data)
    // {
    //     page_current: page_id,
    //     pages: [
    //         {
    //             'id': page_id,
    //             'name': page_name
    //         },
    //         ...
    //     ],
    //     widgets: {
    //         'page_id': {
    //             widget_id: widget_object,
    //             ...
    //         },
    //         ...
    //     }
    // }
    user_data: {
        page_current: '', 
        pages: [
            {
                'id': 'p-1',
                'name': 'Page 1'
            },
            {
                'id': 'p-2',
                'name': 'Page 2'
            },
            {
                'id': 'p-3',
                'name': 'Page 3'
            },
        ],
        widgets: {}
    },

    config: {
        widget_init_position: {
            x: 0,
            y: 0
        },
        widget_init_size: {
            w: 200,
            h: 100
        },
        page_init: [
            {
                'id': 'p-1',
                'name': 'Page 1'
            },
        ],
        page_init_name: 'new page',
        canvas_element: '#canvas',
        canvas_size: {
            four_k: {
                w: 3840,
                h: 2160
            },
            sixteen_nine: {
                w: 1920,
                h: 1080
            },
            nine_sixteen: {
                w: 1080,
                h: 1920
            },
            four_three: {
                w: 1024,
                h: 768
            },
            three_four: {
                w: 768,
                h: 1024
            }
        },
    },

    ui: {
        _buttonAddPage: function(){
            $('.btn-add-page').on('click', function(e){
                e.preventDefault();
                app.page.addPage();
            });
        },
        _sidebarPages: function(){
            $('.menu.side.left ul li:not(:last-child)').on('click', function(e){
                app.page.switchPage($(this).attr('id'));
            });
            $('.menu.side.left ul').sortable({
                item: '> li',
                delay: 50,
                items: 'li:not(:last-child)',
                change: function(e, ui){
                    var order = $(this).sortable('serialize');
                    var order_list = order.split('&');
                    var order_list = order_list.map(function(item){
                        return item.replace('[]', '').replace('=', '-'); 
                    });
                    app.page._updatePageOrder(order_list);
                }
            });
        },
        init: function(){
            this._buttonAddPage();
            this._sidebarPages();
        },
    },

    page: {
        initPage: function(init_var){
            init_var.forEach(function(item){
                app.page.addPage(item);
            });
            app.page.switchPage(init_var[0]['id']);
        },

        _updatePageOrder: function(order_list){
            var new_order = [];
            order_list.forEach(function(page_id){
                new_order.push(_.findWhere(app.user_data.pages, {'id': page_id}));
            });
            app.user_data.pages = new_order;
        },

        switchPage: function(page_id){
            $('.menu.side.left ul li a').removeClass('active');
            $('#' + page_id).find('a').addClass('active');

            app.user_data.page_current = page_id;

            $(app.config.canvas_element)[0].innerHTML = '';

            var widgets = app.user_data.widgets[page_id];
        },

        // addPage / removePage
        // UserData & DOM
        addPage: function(page_info){
            if(page_info){
                var page_id = page_info.hasOwnProperty('id') ?
                              page_info.id : 'p-' + Date.now();
                var page_name = page_info.hasOwnProperty('name') ?
                                page_info.name : app.config.page_init_name;
            }else{
                var page_id = 'p-' + Date.now();
                var page_name = app.config.page_init_name;
                var page_new = true;
            }

            var page = {
                'id': page_id,
                'name': page_name
            };
            app.user_data.pages.push(page);

            var li = $('<li></li>');
            li.attr({'id': page_id});
            var a = $('<a></a>');
            a.html(page_name).appendTo(li);

            if(page_new){
                li.on('click', function(e){
                    app.page.switchPage($(this).attr('id'));
                });
            }

            li.insertBefore($('.menu.side.left ul li:last-child'));
        },
        removePage: function(page_id){
            $('#' + page_id).remove();
            var elem = _.findWhere(app.user_data.pages, {'id': page_id});
            app.user_data.pages.splice(app.user_data.pages.indexOf(elem), 1);
        },
    },

    widget: {
        // Types
        // - text: {text: text string}
        // - image: {url: image url}
        // - video: {url: video url}
        // - carousel: [{url: image url}, ...]
        // - pics: [{url: image url}, ...]
        // - panorama: [{url: image url}, ...]
        // - view360: {top: image url,
        //              bottom: image url,
        //              left: image url,
        //              riht: image url,
        //              front: image url,
        //              behind: image url}
        initWidget: function(type, init_var){
            var base_widget = {
                position: {
                    x: init_var.hasOwnProperty('position') ?
                        init_var['position']['x'] : app.config.widget_init_position.x,
                    y: init_var.hasOwnProperty('position') ?
                        init_var['position']['y'] : app.config.widget_init_position.y
                },
                size: {
                    w: init_var.hasOwnProperty('size') ?
                        init_var['size']['w'] : app.config.widget_init_size.w,
                    h: init_var.hasOwnProperty('size') ?
                        init_var['size']['h'] : app.config.widget_init_size.h
                },
                type: type,
                changePosition: function(new_pos){
                    this.position = new_pos;
                },
                changeSize: function(new_size){
                    this.size = new_size;
                },
                output: $('<div class="widget ui-draggable ui-resizable"></div>'),
                init: function(){
                    var base_method = '_initWidget';
                    var method = base_method +
                                (type.charAt(0).toUpperCase() + type.slice(1));
                    app.widget[method](base_widget, init_var);

                    if(init_var.hasOwnProperty('position')){
                        this.output.css({'top': init_var['position']['y'],
                                        'left': init_var['position']['x']});
                    }
                    if(init_var.hasOwnProperty('size')){
                        this.output.css({'width': init_var['size']['w'],
                                        'height': init_var['size']['h']});
                    }

                    this.output.draggable({
                        containment: 'parent',
                        stop: function(e, ui){
                            base_widget.changePosition(ui.position);
                        }
                    });
                    this.output.resizable({
                        handles: 'n, e, s, w, ne, se, sw, nw',
                        containment: 'parent',
                        stop: function(e, ui){
                            base_widget.changeSize(ui.size);
                        }
                    });
                }
            };

            base_widget.init();

            this.addWidget(base_widget);

            return base_widget;
        },

        _initWidgetText: function(widget, type_var){
            widget.text = type_var['text'];
            widget.output.addClass('widget-text');
            widget.output.html(widget.text);
        },
        _initWidgetImage: function(widget, type_var){
            widget.url = type_var['url'];
            widget.output.addClass('widget-image');
            $('<img>').attr({'src': widget.url}).appendTo(widget.output);
        },
        _initWidgetVideo: function(widget, type_var){
            widget.url = type_var['url'];
            widget.output.addClass('widget-video');
            widget.output.attr({'loop': 'loop', 'preload': 'auto'});
            $('<video>').attr({'src': widget.url}).appendTo(widget.output);
        },
        _initWidgetCarousel: function(widget, type_var){
        },
        _initWidgetPics: function(widget, type_var){
        },
        _initWidgetPanorama: function(widget, type_var){
        },
        _initWidgetView360: function(widget, type_var){
        },

        // addWidget / removeWidget
        // UserData & DOM
        addWidget: function(widget){
            var widget_id = 'w-' + Date.now();
            widget.output.attr({'id': widget_id});
            if(typeof app.user_data.widgets[app.user_data.page_current] == 'undefined'){
                app.user_data.widgets[app.user_data.page_current] = {};
            }
            app.user_data.widgets[app.user_data.page_current][widget_id] = widget;

            $(app.config.canvas_element).append(widget.output);
        },

        removeWidget: function(widget_id){
            $('#' + widget_id).remove();
            delete app.user_data.widgets[app.user_data.page_current][widget_id];
        },
    },

    helper: {
        loadCampaign: function(){},
        saveCampaign: function(){},
    },

    init: function(){
        /*
        newCampaign: function(){
        },
        loadCampaign: function(){
        },
        */
        /*
         * TODO: AJAX get data from remote server, parse and store in user_data
         */
        var data = app.user_data;
        app.page.initPage(data.pages);

        app.ui.init();
    }
};

app.init();

//a = app.initWidget('text');
/*
a = app.widget.initWidget('text', {'text': 'http://www.baidu.com/1.jpg',
                                    'position': {'x': 400, 'y': 200},
                                    'size': {'w': 500, 'h': 100}
                                  });
b = app.widget.initWidget('image', {'url': 'http://jqueryui.com/jquery-wp-content/themes/jquery/images/logo-jquery-ui.png'});
c = app.widget.initWidget('video', {'url': 'https://a0.muscache.com/airbnb/static/Croatia-P1-0.webm'});
*/
//app.init();
