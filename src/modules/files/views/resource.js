(function(Backbone) {
    var ResourceModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.resources_modal_add,
        events: {
            'click #dev__new_resource': 'showAddResource',
            'click #dev__back_to_library': 'showAddFromLibrary',
            ok: 'submit'
        },
        ui:{
            'progress': '#progress',
            'files': '#files',
            'upload_file': '#upload-file',
            'fileupload': '#fileupload'
        },
        initialize: function(options){
            this.assignment = options.assignment;
            this.project = options.project;
            this.resources = new window.Collection.ResourceCollection();
            this.channelName = options.channelName  || 'resources';
            this.resourceChannel = Backbone.Radio.channel(this.channelName);
            this.listenTo(this.resources, 'add', this.addResourceGeneral);
            this.resources.fetch({ data: $.param({ "tags__name": "general"}) });
            this.current_step = 'step1';
        },
        addResourceGeneral: function(model){
            var template = templates.resource_modal_item;
            var html = template(model.toJSON());
            this.$el.find('#dev__resources_general').append(html);
            //this.$el.find('.i-checks').iCheck(icheck_options.get_defaults());
        },
        save: function(){
            var _self = this;
            if(this.current_step === 'step1'){
                this.$el.find('[name=resource-selected]:checked').each(function(index, elem){
                    var elem_id = elem.value;
                    var resource = new window.Model.Resource({id: elem_id});
                    var slug = _self.assignment + "," + _self.project;
                    resource.addTag(slug, _.bind(_self.onTagAdded, _self));
                });
            } else{
                var tab_active = this.$el.find('.tab-pane.active');
                if (tab_active[0].id == 'file'){
                    if(!this.file_data){
                        return;
                    }
                    var name = this.$el.find('#id_file_name').val();
                    this.file_data.name  = name;
                } else{
                    this.file_data = {};
                    this.file_data.name  = this.$el.find('#id_link_name').val();
                    this.file_data.link  = this.$el.find('#id_link').val();
                }
                var resource = new window.Model.Resource(this.file_data);
                resource.save(
                    [],
                    {success: function(resource){
                        var slug = _self.assignment + "," + _self.project;
                        resource.addTag(slug, _.bind(_self.onTagAdded, _self));
                    }});
            }
        },
        onTagAdded: function(response){
            var resource = new window.Model.Resource(response);
            this.resourceChannel.trigger('add-resource', resource);
        },
        showAddResource: function(event){
            event.preventDefault();
            this.$el.find('#dev__filename').html("");
            this.$el.find('#dev__step1').hide();
            this.$el.find('#dev__step2').show();
            this.init_fileupload();
            this.current_step = 'step2';
        },
        showAddFromLibrary: function(event){
            event.preventDefault();
            this.$el.find('#dev__step2').hide();
            this.$el.find('#dev__step1').show();
            this.$el.find(this.ui.fileupload).fileupload('destroy');
            this.current_step = 'step1';
        },
        progress_all: function (event, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            this.$el.find(this.ui.progress).find('.progress-bar').css(
                'width',
                progress + '%'
            );
        },
        start_all: function(event){
             this.$el.find(this.ui.progress).removeClass('hide');
             this.$el.find(this.ui.progress).find('.progress-bar').css("width", "0%");
             $('body').css('cursor', 'wait');
        },
        init_fileupload: function(){
            var url = urlservice.resolve('resource-upload');
            this.$el.find(this.ui.fileupload).fileupload({
                url: url,
                crossDomain: false,
                dataType: 'json',
                done: _.bind(this.process_upload, this),
                progressall: _.bind(this.progress_all, this),
                start: _.bind(this.start_all, this)
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        process_upload: function(e, data){
            var _self = this;
            this.$el.find(this.ui.progress).addClass('hide');
            $('body').css('cursor', 'default');
            this.$el.find('#dev__btn_file').hide();
            setTimeout(function(){
                _self.$el.find('#dev__btn_file').show();
            }, 500);
            this.file_data = data.result;
            this.$el.find('#dev__filename').html(this.file_data.name + "." + this.file_data.extension);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ResourceModal = ResourceModalView;
})(Backbone);
