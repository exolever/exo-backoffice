
function init_customers_select2(partner){
    return {
        minimumInputLength: 0,
        ajax: {
            url: '/graphql/',
            dataType: 'json',
            delay: 250,
            data: function (params) {
              var data = {};
              var query_filter, query_op;
              var variables = {
                'name': params.term,
                'partner': partner
              };
              if (partner){
                query_filter = 'allCustomers (name_Icontains: $name,partner:$partner){ \n';
                query_op = 'query MiQuery ($name: String, $partner: String){ \n';
              } else{
                query_filter = 'allCustomers (name_Icontains: $name,noPartner:true){ \n';
                query_op = 'query MiQuery ($name: String){ \n';
              }
              var query = '\n' +
                   query_op +
                    query_filter +
                      'edges {\n' +
                        'node {\n' +
                          'name\n' +
                          'description\n' +
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
                _.each(result.data.allCustomers.edges, function(value, index){
                  var el = {};
                  el.text = value.node.name;
                  el.id = value.node.pk;
                  requested_data.push(el);
                });

                return {
                  results: requested_data,
                  pagination: {
                    more: (params.page * 30) < result.data.allCustomers.edges.length
                  }
                };
            },
            cache: true
        },
        allowClear: true
    };
}
