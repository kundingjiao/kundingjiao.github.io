fetch('/nav.json')
    .then(
        Response => { return Response.json() }
    ).then((data) => {
        const nav = document.createElement('nav');
        createDirectoryStructure(data, nav);
        document.body.appendChild(nav);
    }).catch((error) => {
        console.error("Error:", error);
    });
// 递归创建左边的导航
function createDirectoryStructure(data, parentElement) {
    data.forEach(item => {
        if (item.类型 === "文件夹") {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = item.名称;
            details.appendChild(summary);
            parentElement.appendChild(details);
            if (item.子项 && item.子项.length > 0) {
                details.setAttribute('open', '');
                createDirectoryStructure(item.子项, details)
            } else if (!item.子项 || item.子项.length === 0) {
                details.setAttribute('data-empty', '');
            }
        } else if (item.类型 === "html") {
            const a = document.createElement('a');
            a.href = '/' + item.路径.replaceAll('\\', '/');
            a.textContent = item.名称;
            parentElement.appendChild(a);
        }
    });
}