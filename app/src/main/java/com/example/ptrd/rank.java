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

public class rank extends AppCompatActivity {

    private WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_rank);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale = 1.0f; // 设置字体缩放比例为 1.0
        getResources().updateConfiguration(configuration, getResources().getDisplayMetrics());

        String rank_name = getIntent().getStringExtra("rank_name");
        // 获取传入的排行榜名称


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

        webView.loadUrl("file:///android_asset/rank/rank.html?name=" + rank_name);
        // 7dul2
    }
}