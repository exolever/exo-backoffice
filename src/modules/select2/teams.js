
function init_teams_select2(project_id){

    return {
        minimumInputLength: 0,
        ajax: {
            url: '/graphql/',
            dataType: 'json',
            delay: 250,
            data: function (params) {
              var data = {};
              var variables = {'project_id': project_id, 'name': params.term};
              var query = '\n' +
                  'query MiQuery ($project_id: String, $name: String){ \n' +
                    'allProject (pk: $project_id){ \n' +
                      'edges {\n' +
                        'node {\n' +
                          'teams (name_Icontains: $name) {\n' +
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
              return data;
            },
            processResults: function (result, params) {
                var requested_data = [];
                params.page = params.page || 1;
                var teams = result.data.allProject.edges[0].node.teams.edges;
                _.each(teams, function(value, index){
                  var el = {};
                  el.text = value.node.name;
                  el.id = value.node.pk;
                  requested_data.push(el);
                });

                return {
                  results: requested_data,
                  pagination: {
                    more: (params.page * 30) < teams.length
                  }
                };
            },
            cache: true
        },
        allowClear: true
    };
}
