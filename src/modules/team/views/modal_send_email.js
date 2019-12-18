(function(Backbone){
    var SendEmailView = Backbone.BootstrapContentModalForm.extend({
        template: templates.team_send_email,
        initialize: function(options){
            this.teams = options.teams;
            this.project_id = options.project_id;
        },
        render: function(){
            var html = this.template({teams: this.teams});
            this.$el.html(html);
            this.getTeams(this.project_id);
            this.$el.find('#id_message').markdown({
                autofocus:false,
                savable:false
            });
            return this.$el;
        },
        getTeams: function(project_id){
            var _self = this;
            var select = this.$el.find('select#id_to');
            var data = {};
            var variables = {'project_id': project_id};
            var query = '\n' +
              'query MiQuery ($project_id: String){ \n' +
                'allProject (pk: $project_id){ \n' +
                  'edges {\n' +
                    'node {\n' +
                      'teams{\n' +
                        'edges {\n' +
                          'node {\n' +
                            'pk, name\n' +
                          '}\n' +
                        '}\n' +
                      '}\n' +
                    '}\n' +
                  '}\n' +
                '}\n' +
              '}\n' +
            '';
            data.variables = JSON.stringify(variables);
            data.query = query;

            $.ajax({
                url: '/graphql/',
                dataType: 'json',
                type: 'post',
                data: data,
                success: function(result){
                    var requested_data = [];
                    var teams = result.data.allProject.edges[0].node.teams.edges;
                    _.each(teams, function(value, index){
                      var el = {};
                      el.text = value.node.name;
                      el.id = value.node.pk;
                      requested_data.push(el);
                    });
                    select.select2({data: requested_data});
                    select.val(_self.teams).trigger('change');
                }
            });
        },
        save: function(){
            var data = {};
            data.subject = this.$el.find("#id_subject").val();
            data.message = this.$el.find("#id_message").val();
            var options = {};
            var formData = new FormData();
            _.each(data, function(value, key){
                formData.append( key, value );
            }, this);
            _.each(this.$el.find('#fileupload')[0].files, function(file){
                formData.append("attachments[]", file);
            }, this);
            _.each(this.$el.find('#id_to').val(), function(team_id, index){
                formData.append("teams[" + index + "]id", team_id);
            }, this);
            var l = this.$el.find("button.btn-positive-choice").ladda();
            l.ladda('start');
            // Set options for AJAX call
            options.data = formData;
            options.processData = false;
            options.contentType = false;
            options.url = urlservice.resolve('send-email-team', this.project_id);
            options.method = 'POST';
            options.success = _.bind(this.submit_ok, this);
            options.error = _.bind(this.submit_error, this);
            $.ajax(options);
        },
        submit_ok: function(){
            var l = this.$el.find("button.btn-positive-choice").ladda();
            l.ladda('stop');
            toastr_manager.show_message('success', '', 'Your message was sent successfully');
        },
        submit_error: function(data){
            toastr_manager.show_message('error', '', 'Something was wrong, please wait');
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.SendEmail = SendEmailView;
})(Backbone);
