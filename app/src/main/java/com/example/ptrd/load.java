package com.example.ptrd;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.microsoft.clarity.Clarity;
import com.microsoft.clarity.ClarityConfig;
import com.microsoft.clarity.models.ApplicationFramework;
import com.microsoft.clarity.models.LogLevel;

import java.util.Collections;

public class load extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_load);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#1D1D1F"));
        }

        ClarityConfig config = new ClarityConfig(
                "o9isthx2ek",  // 你的 ProjectId
                null,          // 默认用户 ID
                LogLevel.None, // 日志级别
                false,         // 禁用按流量计费的网络
                true,          // 启用 WebView 捕获
                Collections.singletonList("*"),  // 允许的域名
                ApplicationFramework.Native,     // 应用框架
                Collections.emptyList(),         // 允许的活动
                Collections.emptyList(),         // 忽略的活动
                false,         // 禁用低端设备
                null           // 每日最大允许的网络使用量 (null = 不限)
        );
        Clarity.initialize(getApplicationContext(), config);

        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale = 1.0f; // 强制字体缩放比例为 1.0
        EdgeToEdge.enable(this);

        webView = findViewById(R.id.webview);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings webSettings = webView.getSettings();

        // 设置 WebViewClient，用于处理页面加载过程中的各种事件
        webView.setWebViewClient(new WebViewClient());
        WebView.setWebContentsDebuggingEnabled(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setJavaScriptEnabled(true);

        webView.addJavascriptInterface(new request(webView), "Request");
        webView.addJavascriptInterface(new jump(this), "Jump");
        webView.addJavascriptInterface(new DataBase(this), "DataBase");

        // 加载可写目录中的 HTML 文件
        webView.loadUrl("file:///android_asset/load/load.html");
    }
}