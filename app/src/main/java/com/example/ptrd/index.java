package com.example.ptrd;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class index extends AppCompatActivity {

    private WebView webView;
    private long backPressedTime;
    private Toast backToast;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_index);
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
        configuration.fontScale = 1.0f; // 设置字体缩放比例为 1.0
        getResources().updateConfiguration(configuration, getResources().getDisplayMetrics());

        EdgeToEdge.enable(this);


        webView = findViewById(R.id.webview);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);


        // 设置 WebViewClient，用于处理页面加载过程中的各种事件
        webView.setWebViewClient(new WebViewClient());
        WebView.setWebContentsDebuggingEnabled(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.addJavascriptInterface(new request(webView), "Request");
        webView.addJavascriptInterface(new jump(this), "Jump");
        webView.addJavascriptInterface(new DataBase(this), "DataBase");
        webView.addJavascriptInterface(new ClipboardHandler(this), "Clipboard");

        // 加载本地 HTML 文件
        webView.loadUrl("file:///android_asset/index/index.html");
    }

    @Override
    public void onBackPressed() {
        // 如果在 1 秒内再次按下返回键
        if (backPressedTime + 1000 > System.currentTimeMillis()) {
            if (backToast != null) {
                backToast.cancel();
            }
            // 切换应用到后台，而不是退出
            moveTaskToBack(true);

            if (false){
                super.onBackPressed();
            } // 不允许切回load_activity
        } else {
            // 第一次按下返回键时显示提示信息
            backToast = Toast.makeText(getBaseContext(), "再次返回以切换到后台。", Toast.LENGTH_SHORT);
            backToast.show();
            // 不直接调用 super.onBackPressed()，防止 Activity 被关闭
        }
        // 更新上次按下返回键的时间
        backPressedTime = System.currentTimeMillis();
    }
}