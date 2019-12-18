(function(Backbone) {
    var template = _.template("<li> \
                                <a href='#' class='change' data-pk='<%= id %>'> \
                                    <i class='m-r-xs fa <%= icon %>'></i> \
                                    <span><%= name %></span> \
                                </a> \
                            </li>");
    var FileAreaHeaderView = Backbone.View.extend({
        el: '#file-area-header',
        events:{
            'click #breadcrumb': 'show_breadcrumb',
            'click .change': 'change_folder',
        },
        template: templates.file_area_header,
        initialize: function(options){
            this.model = options.model;
            this.project_id = options.project_id;
            this.listenTo(this.model, 'change:name', this.manage_label);
            this.fileChannel = Backbone.Radio.channel('files');
        },
        render: function(){
            var html = this.template();
            this.$el.html(html);
            this._ui = {};
            this._ui.folder_name = this.$el.find('#folder-name');
            this.init_search();
            this.$el.find('#breadcrumb').on('show.bs.dropdown', _.bind(this.show_breadcrumb, this));
            return this.$el;
        },
        manage_label: function(model){
            if (!model){
                this._ui.folder_name.html("Root folder");
            }else{
                this._ui.folder_name.html(model.get('name'));
            }
        },
        init_search: function(){
            var elem = this.$el.find('#search_file');
            var select2_options = {};
            select2_options.ajax = ajax_configure_search_folder(this.project_id);
            select2_options.placeholder = {id: '', name: 'Search by name'};
            select2_options.dropdownCssClass = 'search-file';
            select2_options.minimumInputLength = 1;
            select2_options.allowClear = true;
            select2_options.templateResult = _.bind(formatNode, elem);
            select2_options.templateSelection = formatNodeSelection;
            select2_options.escapeMarkup = function (markup) { return markup; };
            elem.select2(select2_options);
            elem.on("select2:select", _.bind(this.select_folder, this));
        },
        select_folder: function(event){
            var elem = this.$el.find('#search_file');
            var channel = Backbone.Radio.channel('files');
            var object_id = event.params.data.id;
            if (!event.params.data.is_folder){
                object_id = event.params.data.parent;
            }
            var model = new window.Model.Folder({
                project_id: this.project_id,
                id: object_id
            });
            channel.trigger('change', model);
            elem.val(null).trigger("change");
        },
        show_breadcrumb: function(event){
            this.$el.find('.dropdown-breadcrumb').empty();
            if (this.model.id){
                this.model.api_folder_path(_.bind(this.processFolderPath, this));
            }
        },
        processFolderPath: function(data){
            this.add_step(new Backbone.Model({name: 'Root', id: null, icon: 'fa-home'}));
            _.each(data, function(info){
                var model = new Backbone.Model(info);
                if (info.id !== this.model.id){
                    model.set('icon', 'fa-folder-o');
                    this.add_step(model);
                }
            }, this);
        },
        add_step: function(model){
            var html = template(model.toJSON());
            this.$el.find('.dropdown-breadcrumb').prepend(html);
        },
        change_folder: function(event){
            event.preventDefault();
            var pk = $(event.currentTarget).data('pk');
            var model = new window.Model.Folder({
                project_id: this.project_id,
                id: pk
            });
            this.fileChannel.trigger('change', model);
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.FileAreaHeader = FileAreaHeaderView;
})(Backbone);
