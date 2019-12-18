/*jshint multistr: true */
(function(Backbone) {
    var TaskItemView = Backbone.View.extend({
        template: templates.dashboard_task,
        tagName: 'li',
        className: 'border-bottom',
        events:{
            'ifClicked .dev__deliver': 'deliver_task',
            'click .dev__deliver': 'deliver_task',
            'click .dev__show_task': 'show_task'
        },
        initialize: function(options){
            this.model = options.model;
            this.project_id = options.project_id;
        },
        render: function(){
            var data = this.model.toJSON();
            data.is_draggable = _.isUndefined(this.project_id);
            data.show_project = _.isUndefined(this.project_id) && data.show_project;
            data.has_to_show_team = data.show_team && data.team_name;
            var html = this.template(data);
            this.$el.html(html);
            this.$el.find('.ichecks').iCheck(icheck_options.get_defaults());
            this.$el.attr('data-project', this.model.get('project_id'));
            this.$el.attr('data-object_id', this.model.get('id'));
            this.$el.attr('data-content_type_id', this.model.get('content_type'));
            return this.$el;
        },
        deliver_task: function(event){
            event.preventDefault();
            this.model.deliver(_.bind(this.processDeliver, this));
        },
        processDeliver: function(){
            toastr_manager.show_message(
                'success',
                "Task delivered successfully",
                ''
            );
            this.model.collection.remove(this.model);
        },
        show_task: function(event){
            event.preventDefault();
            var view = new TaskModalView({
                model: this.model
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                title: "Task details",
                animate: true,
                okText: 'Close',
                allowCancel: false
            });
            modal.open();
        },
        close: function(){
            this.remove();
            this.unbind();
        }
    });

    var TaskCollectionView = Backbone.View.extend({
        el: '#dev__task_todo',
        initialize: function(options){
            this.project_id = options.project_id;
            this.filter = options.filter;
            this.collection = new window.Collection.Task([], {project_id: this.project_id});
            this.listenTo(this.collection, 'add', this.add_one);
            this.listenTo(this.collection, 'remove', this.remove_one);
            this._views = [];
        },
        render: function(){
            var parameters = {
                success: _.bind(this.fetchSuccess, this)
            };
            if (this.filter){
                parameters = _.extend({data: this.filter}, parameters);
            }
            this.collection.fetch(parameters);

            return this.$el;
        },
        add_one: function(model){
            var view = new TaskItemView({
                model: model,
                project_id: this.project_id});
            var $el = view.render();
            this.$el.append($el);
            this._views[model.cid] = view;
        },
        remove_one: function(model){
            var view = this._views[model.cid];
            view.close();
            delete this._views[model.cid];
        },
        fetchSuccess: function(){
            // We can't order task without a project
            if (this.project_id){
                sortable_user_list.initialize({container_tag: '#dev__task_todo'});
            }
            if (this.collection.length === 0){
                var html = "<div class=\"text-center \
                    full-width pull-left m-b-md m-t-md\"> \
                    <i class=\"fa fa-tasks f-24\" aria-hidden=\"true\" \
                    ></i><br>You don't have tasks yet.</div>";
                var html2 = _.template(html)();
                this.$el.append("<li>" + html2 + "</li>");
            }
        }
    });

    var TaskModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.dashboard_task_view,
        initialize: function(options){
            this.model = options.model;
        },
        render: function(){
            var data = this.model.toJSON();
            data.status_display = settings.task.TASK_STATUS[data.status];
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.TaskCollection = TaskCollectionView;

})(Backbone);
