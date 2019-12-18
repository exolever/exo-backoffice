function init_consultant_select2(){
    return {
        minimumInputLength: 0,
        ajax: {
            url: urlservice.resolve('consultant-autocomplete'),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var data = {
                    search: params.term, // search term
                    page: params.page
                };
                return data;
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                $.each(data, function(index, value) {
                    value.text = value.name;
                });
                return {
                    results: data,
                    pagination: {
                      more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        allowClear: true
    };
}
