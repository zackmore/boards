var app = {
    user_data: {
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
        //             ...   //         },
        //         ...
        //     }
        // }

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
        widgets: {},
    },
    config: {
        widget_init: {
            position: {
                x: 0,
                y: 0
            },
            size: {
                w: 200,
                h: 100
            },
            text: 'This property is used by the Text Widget',
            image_url: 'This property is used by the Image Widget',
            video_url: 'This property is used by the Video Widget',
        },
        page_init: [
            {
                'id': 'p-1',
                'name': 'Homepage'
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
        page: {
            init: function(){
                app.user_data.pages.forEach(function(page){
                    app.ui.page.renderPageMenu(page);
                    app.ui.page.renderPage();
                });

                $('.menu.side.left ul').sortable({
                    item: '> li',
                    delay: 50,
                    items: 'li:not(:last-child)',
                    stop: function(e, ui){
                        var order = $(this).sortable('serialize');
                        var order_list = order.split('&');
                        var order_list = order_list.map(function(item){
                            return item.replace('[]', '').replace('=', '-'); 
                        });
                        app.page._updatePageOrder(order_list);
                    }
                });
            },
            highlight: function(page_id){
                $('.menu.side.left ul li a').removeClass('active');
                $('#' + page_id).find('a').addClass('active');
            },
            // Events Bindings
            renderPageMenu: function(data_page){
                var li = $('<li></li>');
                li.attr({'id': data_page.id});
                var a = $('<a></a>');
                a.html(data_page.name).appendTo(li);

                li.on('click', function(e){
                    app.page.switchPage(data_page.id);
                    app.ui.page.highlight(data_page.id)
                });
                li.insertBefore($('.menu.side.left ul li:last-child'));
            },
            derenderPageMenu: function(){},
            renderPage: function(page_id){
                if(typeof app.user_data.widgets[page_id] == 'undefined'){
                    app.user_data.widgets[page_id] = {};
                }
                var ids = _.keys(app.user_data.widgets[page_id]);
                if(ids.length > 0){
                    ids.forEach(function(id){
                        app.ui.widget.renderWidget(app.user_data.widgets[page_id][id]);
                    })
                }
            },
            derenderPage: function(){},
        },
        widget: {
            renderWidget: function(widget){
                $(app.config.canvas_element).append($(widget.output));
            },
            derenderWidget: function(){},
        },
        clearCanvas: function(){
            $(app.config.canvas_element)[0].innerHTML = '';
        },
        initButtons: function(){
            $('.btn-add-page').on('click', function(e){
                e.preventDefault();
                app.page.newPage();
                app.ui.page.renderPageMenu(app.user_data.pages[app.user_data.pages.length - 1]);
            });

            $('.btn-add-widget').on('click', function(e){
                e.preventDefault();
                var widget_type = $(this)[0].classList[1];
                var widget = app.widget.newWidget(widget_type, app.config.widget_init);
                app.ui.widget.renderWidget(widget);
            });
        }
    },
    page: {
        parse: function(data_page){},
        newPage: function(){
            var new_page = {
                'id': 'p-' + Date.now(),
                'name': app.config.page_init_name
            }
            app.user_data.pages.push(new_page);
        },
        deletePage: function(data_page){},

        switchPage: function(page_id){
            $('.menu.side.left ul li a').removeClass('active');
            $('#' + page_id).find('a').addClass('active');

            app.ui.clearCanvas();

            app.user_data.page_current = page_id;
            app.ui.page.renderPage(page_id);
        },

        _updatePageOrder: function(order_list){
            var new_order = [];
            order_list.forEach(function(page_id){
                new_order.push(_.findWhere(app.user_data.pages, {'id': page_id}));
            });
            app.user_data.pages = new_order;
        }
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

        parse: function(data_widget){},
        newWidget: function(type, init_var){
            var base_widget = {
                id: 'w-' + Date.now(),
                position: {
                    x: init_var.hasOwnProperty('position') ?
                        init_var['position']['x'] : app.config.widget_init.position.x,
                    y: init_var.hasOwnProperty('position') ?
                        init_var['position']['y'] : app.config.widget_init.position.y
                },
                size: {
                    w: init_var.hasOwnProperty('size') ?
                        init_var['size']['w'] : app.config.widget_init.size.w,
                    h: init_var.hasOwnProperty('size') ?
                        init_var['size']['h'] : app.config.widget_init.size.h
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

                    this.output.attr({'id': this.id});

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

            app.widget._addWidgetToPage(base_widget, app.user_data.page_current);

            return base_widget;
        },

        _initWidgetText: function(widget, type_var){
            widget.text = type_var['text'];
            widget.output.addClass('widget-text');
            widget.output.html(widget.text);
        },
        _initWidgetImage: function(widget, type_var){
            widget.url = type_var['image_url'];
            widget.output.addClass('widget-image');
            $('<img>').attr({'src': widget.url}).appendTo(widget.output);
        },
        _initWidgetVideo: function(widget, type_var){
            widget.url = type_var['video_url'];
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

        deleteWidget: function(data_widget){},

        _addWidgetToPage: function(widget, page_id){
            app.user_data.widgets[page_id]
            if(typeof app.user_data.widgets[page_id] == 'undefined'){
                app.user_data.widgets[page_id] = {};
            }
            app.user_data.widgets[page_id][widget.id] = widget;
        }
    },
    util: {
        load: function(){},
        save: function(){}
    },
    init: function(){
        // app.util.load();
        if(app.user_data.pages.length <= 0){
            app.user_data.pages = app.config.page_init;
        }
        app.ui.page.init();
        app.page.switchPage(app.user_data.pages[0].id);

        app.ui.initButtons();
    },
};

app.init();
