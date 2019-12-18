(function(Backbone) {
    var ChangePasswordView = Backbone.BootstrapContentModalForm.extend({
        template: templates.user_change_password,
        initialize: function(options){
            this.url = options.url;
        },
        save: function(){
            var password1 = this.$el.find("#id_new_password").val();
            var password2 = this.$el.find("#id_re_new_password").val();
            var data = {
                new_password: password1,
                re_new_password: password2
            };
            this.on_submit(data);
        },
        render: function(){
            Backbone.BootstrapContentModalForm.prototype.render.apply(this, arguments);
            this.$el.find('#id_re_new_password').rules("add",{
                  equalTo: "#id_new_password",
                  minlength: 8
            });
            this.$el.find("#id_new_password").rules("add",{
                minlength: 8
            });
            this.$el.find("#id_new_password").rules("add", {
                remote:{
                    url: urlservice.resolve('api-validate-password'),
                    type: "post",
                    data: {
                        new_password: function() {
                            return $( "#id_new_password" ).val();
                        }
                    },
                    dataFilter: function(data) {
                        var json = JSON.parse(data);
                        if (json.status){
                             return '"true"';
                        }
                        return "\"" + json.new_password[0] + "\"";
                    }
                }
            });
        },
        on_submit: function(data){
            $.ajax({
                url: this.url,
                data: data,
                method: 'put',
                success: _.bind(this.processChangePassword, this),
                error: _.bind(this.processErrorChangePassword, this)
            });
        },
        processChangePassword: function(data){
            toastr_manager.show_message(
                'success',
                'Password updated successfully',
                ''
            );
        },
        processErrorChangePassword: function(data){
            console.log(data);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ChangePassword = ChangePasswordView;
})(Backbone);
