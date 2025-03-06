package com.example.ptrd;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class item extends AppCompatActivity {

    private WebView webView;
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
        webView.getSettings().setDomStorageEnabled(true);  // 启用本地存储

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);  // 允许 Cookie
        cookieManager.setAcceptThirdPartyCookies(webView, true); // 允许第三方 Cookie（跨域）

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
        webView.addJavascriptInterface(new jump(this), "Jump");
        webView.addJavascriptInterface(new DataBase(this), "DataBase");
        webView.addJavascriptInterface(new ClipboardHandler(this), "Clipboard");


        try {
            item_name = URLEncoder.encode(item_name, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            // 可以在这里处理异常，比如使用一个默认编码或报错提示
        }
        webView.loadUrl("https://ptrd.pen-net.cn/assets/item/item.html?name=" + item_name);
        // 7dul2
    }
}