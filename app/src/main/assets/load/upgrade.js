var version = "Beta.0.0.2";

(function() {
    function API_fetch(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.text();
            })
            .then(text => {
                return JSON.parse(text);
            })
            .catch(error => console.error("Download failed:", error));
    }

    API_fetch("http://ptrd.pen-net.cn/api/version")
        .then(data => {
            handle(data)
        })
        .catch(error => {
            console.error("Error:", error.message);
        });

    function handle(infos){
        var update_info = infos.data;

        // 如果最新版本和本地的版本不同
        if (update_info.version != version) {

            var ignored_version = DataBase.query("SELECT * FROM config WHERE name = ?", ["upgrade_ignored"]);

            if (ignored_version.length != 0) {
                ignored_version = ignored_version.replace(" ","").split('\n').map(item => item.split(','))[0][1];

                if (ignored_version == update_info.version){
                    // 删除new_version,避免出现问题
                    DataBase.executeSQL(`
                        DELETE FROM config WHERE name = ?
                    `, ["new_version"]);

                    return // 不更新
                }
            }

            // 最新的版本号
            DataBase.executeSQL(`
                INSERT INTO config (name, value)
                VALUES (?, ?)
                ON CONFLICT(name) DO UPDATE SET value = excluded.value
            `, ["new_version", update_info.version]);

            console.log()

            // 新内容
            DataBase.executeSQL(`
                INSERT INTO config (name, value)
                VALUES (?, ?)
                ON CONFLICT(name) DO UPDATE SET value = excluded.value
            `, ["new_features", update_info.new_features[0]]);
            
            // bug修复
            DataBase.executeSQL(`
                INSERT INTO config (name, value)
                VALUES (?, ?)
                ON CONFLICT(name) DO UPDATE SET value = excluded.value
            `, ["bug_fixes", update_info.bug_fixes[0]]);

            // 完成后跳转至index
            Jump.jump("index","");
        }
    }
    // 7dul2_ p-trd
})()