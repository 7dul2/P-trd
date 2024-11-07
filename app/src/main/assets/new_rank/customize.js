(function() {
    var result = DataBase.query("SELECT * FROM rank",[])
        .trim()
        .split('\n')
        .map(item => item.split(","));

    var customizes = {};

    result.forEach(item => {
        var encode_params = item[1].trim();
        let fixed_params = encode_params.replace(/%u([0-9A-Fa-f]{4})/g, function(match, group) {
            return "%" + group.toUpperCase();
        });
        var decoded_params = decodeURIComponent(fixed_params);
        customizes[item[0]] = JSON.parse(decoded_params);
    });

    console.log(result,customizes);

    for (var key in customizes) {
        if (customizes.hasOwnProperty(key)) {
            routes_new(key, customizes[key]);
        }
    }
})();