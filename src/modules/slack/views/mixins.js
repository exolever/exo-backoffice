(function(){
    var SlackItemView = Backbone.View.extend({
        template: templates.dashboard_slack_channel,
        tagName: 'li',
        className: 'border-bottom',
        initialize: function(options){
            this.model = options.model;
            this.show_project = options.show_project;
            this.project_name = options.project_name;
        },
        render: function(){
            var data = this.model.toJSON();
            data.show_project = this.show_project;
            data.project_name = this.project_name;
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        }
    });

    var SlackMixin = {
        itemClass: SlackItemView,
        initialize: function(options){
            this.project_id = options.project_id;
            this.show_project = options.show_project || 0;
            this.project_name = options.project_name || "";
            this.collection = new window.Collection.SlackChannel([], {
                url: this.$el.data('url'),
                access_token: this.$el.data('token')});
            this.listenTo(this.collection, 'add', this.add_one);
            this.image = this.$el.data('image');
            this._views = [];
        },
        render: function(){
            this.collection.fetch({
                headers: {'Access-Token': this.$el.data('token')},
                success: _.bind(this.clearSpinner, this)
            });
            return this.$el;
        },
        clearSpinner: function(){
            this.$el.find('.sk-spinner').remove();
        },
        add_one: function(model){
            model.set('static_url', this.image);

            var view = new this.itemClass({
                model: model,
                show_project: parseInt(this.show_project) > 1,
                project_name: this.project_name
            });
            var $el = view.render();
            this.$el.append($el);
            this._views[model.cid] = view;
        }
    };
    Cocktail.mixins.view_slack = SlackMixin;
})();
