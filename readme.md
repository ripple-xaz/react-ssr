# react
## client-entry.js导出的内容为可在浏览器执行的js， js包含 jsx 和 渲染方法，执行该js会将 jsx解析成dom，并添加到root节点中
## server-entry.js 导出的内容为 jsx，通过reactDomServer.renderToString方法可以得到 dom。