
function init_partners_select2(){

    return {
        minimumInputLength: 0,
        ajax: {
            url: '/graphql/',
            dataType: 'json',
            delay: 250,
            data: function (params) {
              var data = {};
              var variables = {'name': params.term};
              var query = '\n' +
                  'query MiQuery ($name: String){ \n' +
                    'allPartners (name_Icontains: $name){ \n' +
                      'edges {\n' +
                        'node {\n' +
                          'name\n' +
                          'pk\n' +
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
                _.each(result.data.allPartners.edges, function(value, index){
                  var el = {};
                  el.text = value.node.name;
                  el.id = value.node.pk;
                  requested_data.push(el);
                });

                return {
                  results: requested_data,
                  pagination: {
                    more: (params.page * 30) < result.data.allPartners.edges.length
                  }
                };
            },
            cache: true
        },
        allowClear: true
    };
}
