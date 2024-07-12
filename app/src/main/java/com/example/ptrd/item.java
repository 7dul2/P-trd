package com.example.ptrd;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class item extends AppCompatActivity {

    private WebView webView;
    private WebView webView2;

    private CustomWebViewClient customWebViewClient;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale = 1.0f; // 设置字体缩放比例为 1.0
        getResources().updateConfiguration(configuration, getResources().getDisplayMetrics());

        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_item);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        String item_name = getIntent().getStringExtra("item_name");
        // 获取传入的商品名称

        webView = findViewById(R.id.webview);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        // 禁用滚动引起的形变动画

        webView.setWebViewClient(new WebViewClient());
        // 设置 WebViewClient，用于处理页面加载过程中的各种事件

        WebView.setWebContentsDebuggingEnabled(true);
        // 允许调试

        webView.getSettings().setJavaScriptEnabled(true);
        // 启用 JavaScript

        webView.getSettings().setUseWideViewPort(true);
        // 启用广泛视口，使页面能够适应屏幕宽度

        webView.addJavascriptInterface(new request(webView), "Request");
        // 用于发送请求的方法类

        webView.loadUrl("file:///android_asset/item/item.html?name=" + item_name);
        // 7dul2

        webView2 = findViewById(R.id.webview2);

        CustomBridge customBridge = new CustomBridge(this, webView, webView2);
        webView.setWebViewClient(customBridge);
        customBridge.registerInterface(webView);
        // 对接两个webview

        CustomWebViewClient webViewClient = new CustomWebViewClient(this);
        webView2.setWebViewClient(webViewClient);
        // 网络代理

        webView2.getSettings().setJavaScriptEnabled(true);
        webView2.getSettings().setDomStorageEnabled(true);
        webView2.setWebContentsDebuggingEnabled(true);

        webView2.loadUrl("https://csgoob.com/goods?name=" + item_name);
    }
}