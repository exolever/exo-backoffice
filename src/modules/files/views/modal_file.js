(function(Backbone) {
    var FileModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.file_form,
        initialize: function(options){
            this.file = options.file;
            this.model = new window.Model.Folder(options.folder);
            this.channelName = options.channelName  || 'files';
            this.fileChannel = Backbone.Radio.channel(this.channelName);
            this.exo_project = new window.Collection.ExOProject([], {
                project_id: this.model.project_id
            });
            this.query = "";
        },
        render: function(){
            var data = {file: this.file, folder: this.model};
            data.show_folder_select = _.isUndefined(this.file.id) || _.isUndefined(this.model.id);
            data.folder_required = _.isUndefined(this.model.id);
            this.$el.html(this.template(data));
            this.exo_project.fetch({
                success: _.bind(this.show_projects, this)
            });
            this.build_path();
            if (this.file.id || !this.model.id){
                this.init_select2_folder();
            }
        },
        save: function(){
            var name = this.$el.find("#id_file_name").val();
            var project = this.$el.find("#id_project").val();
            var description = this.$el.find("#id_description").val();
            var data = {
                name: name,
                description: description,
                exo_project: project
            };
            if (this.file.project_id){
                data.project_id = this.file.project_id;
            }
            if (this.file.id){
                data.new_folder = this.$el.find('#id_folder').val();
                data.id = this.file.id;
                this.fileChannel.trigger('update-file', data);
            }else{
                if (!this.model.id){
                    data.new_folder = this.$el.find('#id_folder').val();
                }
                data._filename = this.file.new_file_name;
                data.mimetype = this.file.content_type;
                data.extension = this.file.extension;
                this.fileChannel.trigger('create-file', data);
            }
        },
        build_path: function(){
            if (this.model.id){
                this.$el.find('#folder_path').append(this.model.get_folder_path());
            }
        },
        show_projects: function(){
            var template = _.template("<option value='<%= id %>'><%= name %></option>");
            this.exo_project.each(function(model){
                var html = template(model.toJSON());
                this.$el.find('#id_project').append(html);
            }, this);
            this.$el.find('#id_project').select2();
            if (this.file.exo_project){
                this.$el.find('#id_project').val(this.file.exo_project).trigger("change");
            }
        },
        init_select2_folder: function(){
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
                placeholder: {id: '', text: 'Select a new folder'},
                data: custom_data,
                minimumInputLength: 0,
                templateResult: _.bind(configure_result, elem)
            });
            this.$el.find('#id_folder').prop('disabled', false);
            if (this.model.id){
                this.$el.find('#id_folder').val(this.model.id).trigger('change');
            }

        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.FileModalView = FileModalView;
})(Backbone);
