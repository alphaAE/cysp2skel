const { Menu, dialog } = require("electron");

menuTemplate = [
  // { role: 'appMenu' }
  ...[
    {
      label: "文件",
      submenu: [
        {
          label: "打开文件",
          click: async () => {
            dialog
              .showOpenDialog({
                filters: [
                  { name: "Json", extensions: ["json"] },
                  { name: "All Files", extensions: ["*"] },
                ],
                properties: ["openFile", "multiSelections"],
              })
              .then((result) => {
                if (result.canceled) return;
                console.log(result.filePaths);
              });
          },
        },
        { type: "separator" },
        { label: "退出", role: "quit" },
      ],
    },
  ],
  {
    label: "帮助",
    submenu: [
      { label: "开发者工具", role: "toggledevtools" },
      { label: "重载应用", role: "reload" },
      { label: "关于", role: "about" },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuTemplate);

module.exports = menu;
