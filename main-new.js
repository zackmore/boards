var app = {
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
        widgets: {},
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
        page_menu: {
            init: function(){},
            // Events Bindings
        },
        widget_menu: {
            init: function(){},
            // Events Bindings
        },
        canvas: {
            render_page: function(data_page){},
            render_widget: function(obj_widget){},
            clear: function(){
                $(app.config.canvas_element)[0].innerHTML = '';
            }
        }
    },
    page: {
        parse: function(data_page){},
        newPage: function(){},
        deletePage: function(data_page){}
    },
    widget: {
        parse: function(data_widget){},
        newWidget: function(){},
        deleteWidget: function(data_widget){}
    },
    util: {
        load: function(){},
        save: function(){}
    },
    init: function(){
    },
};

app.init();
