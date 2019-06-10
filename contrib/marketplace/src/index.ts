// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import "core-js/stable";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import { resolve } from "url";

import App from "./App";

declare let __webpack_public_path__: string;
const publicPath = __webpack_public_path__ = resolve((window.document.currentScript as HTMLScriptElement).src, "./");

(window as any).MonacoEnvironment = {
  getWorkerUrl() {
    const code = `
    self.MonacoEnvironment = { baseUrl: '${publicPath}' };
    importScripts('${resolve(publicPath, "editor.worker.js")}');`;
    return `data:application/javascript;charset=utf-8,${encodeURIComponent(code)}`;
  },
};

declare interface IWindow {
  PAI_PLUGINS: Array<{ id?: string, uri?: string, title?: string }>;
}

class MarketplacePluginElement extends HTMLElement {
  public connectedCallback() {
    const api = this.getAttribute("pai-rest-server-uri") as string;
    const user = this.getAttribute("pai-user") as string;
    const token = this.getAttribute("pai-rest-server-token") as string;

    let submissionId;
    const plugins = (window as unknown as IWindow).PAI_PLUGINS;
    for (const i in plugins) {
      if (plugins[i].id === "submit-job-v2") {
        submissionId = i;
      }
    }

    ReactDOM.render(React.createElement(App, {api, user, token, submissionId}), this);
  }

  public disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this);
  }
}

window.customElements.define("pai-plugin", MarketplacePluginElement);
