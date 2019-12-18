(function(Backbone) {
    var SelectFileView = Backbone.BootstrapContentModalForm.extend({
        template: templates.modal_select_file,
        events: {
            ok: 'submit',
            'change #id_folder': 'select_folder'
        },
        initialize: function(options){
            this.channel = Backbone.Radio.channel(options.channel_name);
            this.project_id = options.project_id;
            this.model = new window.Model.Folder({project_id: this.project_id});
            this.listenTo(this.model.get('files'), 'reset', this.reset_files);
        },
        render: function(){
            this.$el.html(this.template());
            this.init_select2_folder();
            return this.$el;
        },
        init_select2_folder: function(){
            var _self = this;
            this.$el.find('#list-files').parent().addClass('hide');
            this.$el.find('#id_folder').prop('disabled', true);
            $.get(
                urlservice.resolve('api-folder-autocomplete', this.model.project_id),
                _.bind(this.init_select2_data, this)
            );
        },
        init_select2_data: function(data){
            var elem = this.$el.find('#id_folder');
            var custom_data = $.map(data, function (obj) {
                obj.text = obj.full_path; // replace name with the property used for the text
                return obj;
            });
            elem.find("option").html("");
            this.$el.find('#id_folder').select2({
                placeholder: {id: '', text: 'Choose a folder'},
                data: custom_data,
                minimumInputLength: 0,
                templateResult: _.bind(configure_result, elem)
            });
            this.$el.find('#id_folder').prop('disabled', false);
        },
        reset_files: function(collection){
            var element = this.$el.find('#list-files');
            element.empty();
            collection.each(function(model){
                var html = templates.modal_select_file_item(model.toJSON());
                element.append(html);
            }, this);
            this.$el.find('.i-checks').iCheck(icheck_options.get_defaults());
            if(collection.length === 0){
                element.append("<p>No files in folder</p>");
            }
        },
        select_folder: function(){
            var value = this.$el.find('#id_folder').val();
            this.$el.find('#list-files').parent().removeClass('hide');
            this.model.id = value;
            this.model.get_files();
        },
        save: function(){
            var files = this.$el.find("[name='file-selected']:checked");
            var _self = this;
            files.each(function(index, element){
                var file = _self.model.get('files').findWhere({
                    id: parseInt(element.value)});
                _self.channel.trigger("select-file", file);
            });
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.SelectFile = SelectFileView;
})(Backbone);
