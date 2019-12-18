(function(Backbone) {
    var BreadcrumbItemView = Backbone.View.extend({
        tagName: 'div',
        events:{
            'click': 'select_folder',
        },
        className: 'pull-left',
        template: _.template("<a class='file-control'><%= name %></a>"),
        initialize: function(options){
            this.model = options.model;
            this.fileChannel = Backbone.Radio.channel('files');
            this.listenTo(this.model, 'change:active', this.check_active);
            this.fileChannel.on('create-update-folder', _.bind(this.update_folder, this));
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.check_active();
            return this.$el;
        },
        add_active: function(){
            this.$el.find('a').addClass('active');
        },
        remove_active: function(){
            this.$el.find('a').removeClass('active');
        },
        select_folder: function(){
            event.preventDefault();
            this.fileChannel.trigger('change', this.model);
        },
        close: function(){
            this.remove();
            this.unbind();
        },
        check_active: function(){
            if(this.model.get('active')){
                this.$el.find('a').addClass('active');
            }
            else{
                this.$el.find('a').removeClass('active');
            }
        },
        update_folder: function(data){
            if (data.id && data.id === this.model.id){
                this.model.set('name', data.name);
                this.model.set('order', data.order);
                this.render();
            }
        }
    });

    var BreadcrumbCollectionView = Backbone.View.extend({
        itemView: BreadcrumbItemView,
        initialize: function(options){
            this.channel = Backbone.Radio.channel('files');
            this.channel.on('change', _.bind(this.on_change, this));
            this.channel.on('change-folder-parent', _.bind(this.change_folder_parent, this));
            this.collection = [new Backbone.Model({name: 'Root folder', id: null})];
            this._views = {};
            this.current = this.collection[0];
        },
        on_change: function(model){
            _.each(this.collection, function(model){
                model.set('active', false);
            }, this);
            var pos = this.search_collection(model);
            if (pos >=0){
                var i = pos +1;
                while(i < this.collection.length){
                    this.remove_step(this.collection[i]);
                }
            }else{
                var last_model = _.last(this.collection);
                if (last_model.get('id') === model.get('parent')){
                    this.add_step(model);
                }
                else{
                    this.go_step(model);
                }
            }
            this.mark_current(model);
        },
        change_folder_parent: function(){
            var length = this.collection.length;
            var model = this.collection[length - 2];
            this.channel.trigger('change', model);
        },
        add_step: function(model, options){
            var opt = options || {add: true};
            if (opt.add){
                this.collection.push(model);
            }
            var view = new this.itemView({model: model});
            view.render();
            this._views[model.id] = view;
            this.$el.append(view.$el);
            return view;
        },
        remove_step: function(model){
            if (!model.get('id')){
                return;
            }
            var index = this.collection.indexOf(model);
            this.collection.splice(index, 1);
            var view = this._views[model.id];
            view.close();
            delete this._views[model.id];
        },
        clear_step: function(){
            var i = 1;
            while(i < this.collection.length){
                this.remove_step(this.collection[i]);
            }
        },
        render: function(){
            this.$el.html("");
            _.each(this.collection, function(model){
                var view = this.add_step(model, {add: false});
                this.$el.append(view.$el);
            }, this);
            this.mark_current(this.current);
            return this.$el;
        },
        mark_current: function(model){
            this.current = model;
            model.set('active', true);
        },
        search_collection: function(model){
            var pos = -1;
            _.each(this.collection, function(m1, index){
                if (m1.id === model.id){
                    pos = index;
                }
            }, this);
            return pos;
        },
        go_step: function(model){
            this.clear_step();
            if (model.id){
                model.api_folder_path(_.bind(this.processFolderPath, this));
            }
        },
        processFolderPath: function(data){
            _.each(data, function(info){
                var model = new Backbone.Model(info);
                this.add_step(model);
            }, this);
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.BreadcrumbItemView = BreadcrumbItemView;
    window.View.BreadcrumbCollectionView = BreadcrumbCollectionView;
})(Backbone);
