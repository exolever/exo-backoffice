/**
    Change Project Status
*/

(function(Backbone) {
    var ChangeProjectStatusView = Backbone.BootstrapContentModalForm.extend({
        template: templates.project_change_status,
        initialize: function(options){
            this.label = options.label;
            this.new_status = options.status;
            this.date = options.date;
            this.badges = options.badges;
            this.url = urlservice.resolve('project-change-status', options.project_id);
        },
        save: function(){
            var data = {
                new_status: this.new_status,
                date: this.$el.find('#id_date').val()
            };
            if (this.badges){
                data.confirm_badges = this.$el.find('#id_badges').is(':checked');
            }
            this.on_submit(data);
        },
        render: function(){
            var data = {
                label: this.label,
                date: this.date,
                badges: this.badges};
            this.$el.html(this.template(data));
            this.$el.find('.i-checks').iCheck(icheck_options.get_defaults());
            this.$el.find("#id_date").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                autoclose: true});
        },
        on_submit: function(data){
            $.ajax({
                url: this.url,
                data: data,
                method: 'put',
                success: _.bind(this.successChangeStatus, this),
                error: _.bind(this.errorChangeStatus, this)
            });
        },
        successChangeStatus: function(data){
            var message;
            switch(this.new_status){
                case 'F':
                    message = 'Service is marked as finish';
                    break;
                case 'S':
                    message = 'Service is marked as started';
                    break;
                case 'W':
                    message = 'Service launched. Please, start it manually on ' +  this.$el.find('#id_date').val() + ".";
                    break;
            }
            toastr_manager.show_message(
                'success',
                message,
                ''
            );
        },
        errorChangeStatus: function(data){
            var message = data.responseJSON.non_field_errors.join();
            toastr_manager.show_message(
                'error',
                message,
                ''
            );
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.ChangeStatusProjectFinish = ChangeProjectStatusView;

})(Backbone);
