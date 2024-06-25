package com.example.ptrd;

import android.content.Context;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

public class CustomWebViewClient extends WebViewClient {

    private Context mContext;

    public CustomWebViewClient(Context context) {
        mContext = context;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
        // 如果请求的是 echarts.min.js 文件，返回本地的 echarts.min.js 文件
        if (url.contains("echarts.min.js") && !url.contains("klinecharts.min.js")) {
            try {
                InputStream inputStream = mContext.getAssets().open("echarts.min.js");
                return new WebResourceResponse("application/javascript", "UTF-8", inputStream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // 其他请求不做处理，交由 WebView 处理
        return super.shouldInterceptRequest(view, url);
    }
}
