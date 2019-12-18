(function(Backbone) {
    var SlackChannelProjectCollectionView = Backbone.View.extend({
        el: '#dev__slack_channels',
        mixins: ['view_slack']
    });

    var SlackChannelCollectionView = Backbone.View.extend({
        mixins: ['view_slack'],
        tagName: 'ul',
        className: 'unstyled p-l-0 m-b-none',
        initialize: function(options){
            this.$el.data('url', options.url);
            this.$el.data('token', options.token);
            this.$el.data('image', options.image);
            this.$el.data('show_project', options.show_project);
            this.$el.data('project_name', options.project_name);
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.SlackChannelProjectCollection = SlackChannelProjectCollectionView;
    window.View.SlackChannelCollection = SlackChannelCollectionView;

})(Backbone);
