package com.example.ptrd;

import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.util.ArrayList;
import java.util.List;

import okhttp3.OkHttpClient;

public class index extends AppCompatActivity {

    private WebView webView;
    private WebView webView2;
    private CustomWebViewClient customWebViewClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale = 1.0f; // 强制字体缩放比例为 1.0
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_index);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        webView = findViewById(R.id.webview);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        webView2 = findViewById(R.id.webview2);




        // 设置 WebViewClient，用于处理页面加载过程中的各种事件
        webView.setWebViewClient(new WebViewClient());
        WebView.setWebContentsDebuggingEnabled(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.addJavascriptInterface(new request(webView), "Request");


        CustomBridge customBridge = new CustomBridge(this, webView, webView2);
        webView.setWebViewClient(customBridge);
        customBridge.registerInterface(webView);


        CustomWebViewClient webViewClient = new CustomWebViewClient(this);
        webView2.setWebViewClient(webViewClient);

//        webView.addJavascriptInterface(new network(customWebViewClient), "network");
        webView2.getSettings().setJavaScriptEnabled(true);
        webView2.getSettings().setDomStorageEnabled(true);
        webView2.setWebContentsDebuggingEnabled(true);
//        webView2.loadUrl("https://csgoob.com/goods?name=%E6%A0%BC%E6%B4%9B%E5%85%8B%2018%20%E5%9E%8B%20%7C%20%E4%BC%BD%E7%8E%9B%E5%A4%9A%E6%99%AE%E5%8B%92%20(%E5%B4%AD%E6%96%B0%E5%87%BA%E5%8E%82)");
        webView2.loadUrl("https://www.csgoob.com/");
        // 加载本地 HTML 文件
        webView.loadUrl("file:///android_asset/index/index.html");
    }

}