// ==UserScript==
// @name         清览题库|清览测验复制题目与代码粘贴工具
// @namespace    https://app.qingline.net/student/examing*
// @version      0.2
// @description  为清览题库的清览测验提供复制题目、代码黏贴和自动退出全屏功能。
// @author       NellPoi
// @connect      *
// @match        https://app.qingline.net/student/examing*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489692/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%7C%E6%B8%85%E8%A7%88%E6%B5%8B%E9%AA%8C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%A8%E5%B1%8F%EF%BC%88QINGLINE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/489692/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%7C%E6%B8%85%E8%A7%88%E6%B5%8B%E9%AA%8C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%A8%E5%B1%8F%EF%BC%88QINGLINE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    // 脚本启动时的日志输出
    console.log('清览题库|清览测验禁用复制和全屏 => start');
    'use strict'; // 启用严格模式，提高代码规范性

    // 在窗口加载完成后执行初始化
    window.addEventListener('load', function () {
        // 延迟1秒执行init函数，确保页面元素加载完成
        setTimeout(() => {
            init();
        }, 1000);
    });

    // 获取题目文本的函数
    function getQuesText() {
        // 定义简便的选择器函数，返回元素数组
        const $ = (s) => [...document.querySelectorAll(s)];

        // 获取题干内容并进行格式处理：
        // 1. 移除开头的题号（如"(1)"）
        // 2. 移除句末的标点（。或？）
        // 3. 将空的括号替换为空格
        const head = $(".stem")[0]
            .textContent
            .trim()
            .replace(/^（[0-9]+）/, "")
            .replace(/[。？]/, "")
            .replace(/（\s+?）/g, " ");

        // 获取所有选项内容并用空格连接
        const body = $(".sec_item")
            .map((option) => option.textContent.trim())
            .join(" ");

        // 返回完整的题目文本（题干+选项）
        return head + "\n" + body;
    }

    // 初始化函数，包含主要功能实现
    function init() {
        // 初始化时的日志输出
        console.log('清览题库|清览测验禁用复制和全屏 => init');

        // 获取页面中的fixed_con元素作为按钮容器
        const fixedCon = document.querySelector('.fixed_con');

        // 创建复制按钮
        const newButton = document.createElement('button');
        newButton.type = 'button'; // 设置按钮类型
        newButton.style.marginRight = "10px"; // 设置右边距
        newButton.className = 'complete_btn ant-btn'; // 添加样式类

        // 创建按钮内的文本span
        const newSpan = document.createElement('span');
        newSpan.textContent = '复制当前题目题目和内容'; // 设置按钮文本
        newButton.appendChild(newSpan); // 将span添加到按钮中

        // 将新按钮插入到fixed_con的开头
        fixedCon.insertBefore(newButton, fixedCon.firstChild);

        // 为按钮添加点击事件监听器
        newButton.addEventListener('click', function () {
            const textToCopy = getQuesText(); // 获取要复制的题目文本

            // 使用剪贴板API复制文本
            navigator.clipboard.writeText(textToCopy)
                .then(function () {
                    // 复制成功时的处理
                    console.log('Text copied to clipboard');

                    // 创建复制成功的提示消息
                    const copySuccessMessage = document.createElement('div');
                    copySuccessMessage.textContent = '复制成功~';
                    // 设置提示消息的样式
                    copySuccessMessage.style.position = 'fixed';
                    copySuccessMessage.style.bottom = '10px';
                    copySuccessMessage.style.right = '10px';
                    copySuccessMessage.style.padding = '10px';
                    copySuccessMessage.style.backgroundColor = '#3d64ff';
                    copySuccessMessage.style.color = 'white';
                    copySuccessMessage.style.borderRadius = '5px';
                    document.body.appendChild(copySuccessMessage);

                    // 2秒后隐藏提示消息
                    setTimeout(function () {
                        copySuccessMessage.style.display = 'none';
                    }, 2000);
                })
                .catch(function (error) {
                    // 复制失败时的处理
                    console.error('Failed to copy text to clipboard:', error);
                });
        });

        // 检查并移除全屏提示弹窗
        const modal = document.querySelector('.ant-modal-body');
        console.log(modal); // 输出弹窗元素用于调试
        if (modal) {
            // 如果存在弹窗，则移除整个弹窗根元素
            const modalRoot = document.querySelector('.ant-modal-root.ant-modal-confirm.ant-modal-confirm-info.ant-modal-info.ant-modal-confirm.ant-modal-confirm-info.ant-modal-info');
            modalRoot.remove();
        }
    }
})();