(function(Backbone) {
    var ScheduleRequestCollaboratorModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.schedule_request_collaborator,
        initialize: function(options){
            this.request = options.request;
            this.channel_name = options.channel_name;
            this.consultant = {};
        },
        render: function(){
            var _self = this;
            this.$el.html(this.template(this.request.toJSON()));
            this.$el.find('#id_consultant.select2').select2(init_consultant_select2());
            this.$el.find('#id_consultant').on('select2:selecting', function (e) {
                _self.consultant = e.params.args.data;
            });
            this.$el.find('.i-checks').iCheck(icheck_options.get_defaults());
        },
        save: function(){
            var name = this.consultant.name;
            var email = this.consultant.email;
            var id = this.consultant.id;
            var timeslot_id = this.$el.find('input[name=timeslot]:checked').val();
            this.request.mark_schedule(id, timeslot_id, this.channel_name);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ScheduleRequestCollaborator = ScheduleRequestCollaboratorModalView;
})(Backbone);
