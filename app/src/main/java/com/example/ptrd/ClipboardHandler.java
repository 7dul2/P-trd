package com.example.ptrd;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.webkit.JavascriptInterface;
public class ClipboardHandler {
    Context mContext;

    // 构造函数
    ClipboardHandler(Context c) {
        mContext = c;
    }

    // 复制文本到剪贴板
    @JavascriptInterface
    public void copyToClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("copied text", text);
        clipboard.setPrimaryClip(clip);

        // 显示一个简单的Toast作为反馈
    }
}
