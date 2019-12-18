/**
    Init data for Industry Select2 fields
 */
function init_industry_select2(){
    return {
        ajax: {
            url: urlservice.resolve('industry-select2'),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
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


/**
    Init data for Industry select2 fields
 */
function init_industry_size_select2(){
    return { data: settings.organization_size, allowClear: true };
}
