"use strict";

import { app, protocol, BrowserWindow, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

import menuBar from "./menuBar";
Menu.setApplicationMenu(menuBar);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果处于开发模式，则加载开发服务器的 url
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // 未处于开发模式时加载 index.html
    win.loadURL("app://./index.html");
  }
}

// 关闭所有窗口后退出
app.on("window-all-closed", () => {
  // 在 macOS 上，应用程序及其菜单栏通常保持活动状态，直到用户使用 Cmd + Q 明确退出
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // 在 macOS 上，当单击停靠图标并且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 这个方法会在 Electron 完成时调用
// 初始化并准备好创建浏览器窗口
// 某些API只有在该事件发生后才能使用。
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // 安装 Vue 开发工具
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
