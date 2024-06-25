package com.example.ptrd;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class request {
    private WebView webView;
    private Handler mainHandler;

    public request(WebView webView) {
        this.webView = webView;
        mainHandler = new Handler(Looper.getMainLooper());
    }

    @JavascriptInterface
    public void get(String url,String key, String callback) {
        NetworkUtils.fetchData(url, new NetworkUtils.Callback() {
            @Override
            public void onSuccess(String response) {
                mainHandler.post(() -> {
                    String jsCallback = "javascript:" + callback + "('" + key + "',"+ "`" + response + "`)";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }

            @Override
            public void onError(Exception e) {
                mainHandler.post(() -> {
                    String errorResponse = "Error: " + e.getMessage();
                    String jsCallback = "javascript:" + callback + "('err',`" + errorResponse + "`)";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }
        });
    }

    @JavascriptInterface
    public void post(String url, String jsonArray, String callback) {
        NetworkUtils.postData(url, jsonArray, new NetworkUtils.Callback() {
            @Override
            public void onSuccess(String response) {
                mainHandler.post(() -> {
                    String jsCallback = "javascript:" + callback + "('" + response + "')";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }

            @Override
            public void onError(Exception e) {
                mainHandler.post(() -> {
                    String errorResponse = "Error: " + e.getMessage();
                    String jsCallback = "javascript:" + callback + "('" + errorResponse + "')";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }
        });
    }
}
