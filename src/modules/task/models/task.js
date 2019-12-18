(function(Backbone) {
    var TaskFilesCollection = Backbone.Collection.extend({
        model: window.Model.File,
        initialize: function(models, options){
            this.project_id = options.project_id;
            this.task_id = options.task_id;
        },
        url: function(){
            return urlservice.resolve('task-files-related', this.project_id, this.task_id);
        }
    });

    var TaskModel = Backbone.Model.extend({
        mixins: ['related_file'],
        initialize: function(options){
            this.set('project', options.project_id);
            if (options.id === undefined){
                this.set('assigned_to', []);
                this.set('files', new TaskFilesCollection([], {
                    project_id: this.get('project_id'),
                    task_id: this.get('id')
                }));
            }
        },
        url: function(){
            if (this.id){
                return urlservice.resolve('task-edit', this.get('project'), this.id);
            }
            return urlservice.resolve('task-create', this.get('project'));
        },
        assign_workers: function(form){
            this.set('assigned_to', []);
            var worker_dict = {
                'object_type': form.find('#id_role_assign option:selected').data('ctype'),
                'object_id': form.find('#id_object_assign').val(),
                'object_role': form.find('#id_role_assign option:selected').val()
            };
            if (worker_dict.object_role === '_'){
                delete worker_dict.object_role;
            }
            this.attributes.assigned_to.push(worker_dict);
        },
        parse: function(response, options){
            var hash = Backbone.Model.prototype.parse.apply(this, arguments);
            var files = new Backbone.Collection(response.files);
            hash.files = files;
            return hash;
        },
        get_files: function(){
            var collection = new TaskFilesCollection([], {
                project_id: this.get('project_id'),
                task_id: this.get('id')
            });
            this.set('files', collection);
            collection.fetch();
        },
        url_add: function(){
            return urlservice.resolve(
                'task-files-related',
                this.get('project_id'), this.get('id'));
        },
        url_remove: function(file){
            return urlservice.resolve(
                'task-remove-file',
                this.get('project_id'),
                this.get('id'),
                file.id);
        },
        deliver: function(callback){
            var project_id = this.get('project_id');
            var task_id = this.get('id');
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('task-deliver', project_id, task_id),
                data: {id: task_id, project: project_id},
                success: callback
            });
        }
    });

    var TaskCollection = Backbone.Collection.extend({
        model: TaskModel,
        initialize: function(objects, options){
            this.project_id = options.project_id;
        },
        url: function(){
            if (this.project_id){
                return urlservice.resolve('task-project', this.project_id);
            } else{
                return urlservice.resolve('task-user');
            }

        }
    });

    if (typeof window.Model === 'undefined') window.Model = {};
    window.Model.Task = TaskModel;

    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Collection.Task = TaskCollection;
})(Backbone);
