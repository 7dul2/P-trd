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
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
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
        // 加载本地 HTML 文件
        webView.loadUrl("file:///android_asset/load/load.html");
    }
}