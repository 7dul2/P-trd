package com.example.ptrd;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.Context;

import androidx.annotation.NonNull;

public class CustomBridge extends WebViewClient {
    private Context mContext;
    private WebView webView;
    private WebView webView2;
    private Handler mHandler;

    public CustomBridge(Context context, WebView webView, WebView webView2) {
        this.mContext = context;
        this.webView = webView;
        this.webView2 = webView2;
        this.mHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        // 这里可以拦截特定的请求，如果需要的话
        return super.shouldInterceptRequest(view, request);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        view.evaluateJavascript("window.customBridge = {" +
                "processCode: function(code) {" +
                "    if (window.ci && window.ci.fetch_datas) {" +
                "        window.ci.fetch_datas(code);" +
                "    } else {" +
                "        console.error('CustomWebViewClient or processCode is undefined');" +
                "    }" +
                "}}['processCode'];", null);
    }

    public class JavaScriptInterface {
        @JavascriptInterface
        public void fetch_datas(final String code) {
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    try {
                        String tempFunction = "function custom_temp() { return " + code + "; } custom_temp();";
                        webView2.evaluateJavascript(tempFunction, new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String result) {
                                String jsCode = "var custom_temp_result = " + result;
                                webView.evaluateJavascript(jsCode, null);
                            }
                        });
                    } catch (Exception e) {
                        e.printStackTrace();
                        Log.e("CustomBridge", "Error: " + e.getMessage());
                    }
                }
            });
        }
    }

    public void registerInterface(WebView webView) {
        webView.addJavascriptInterface(new JavaScriptInterface(), "ci");
    }
}
