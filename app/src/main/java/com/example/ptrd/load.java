package com.example.ptrd;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.OutOfQuotaPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.microsoft.clarity.Clarity;
import com.microsoft.clarity.ClarityConfig;
import com.microsoft.clarity.models.ApplicationFramework;
import com.microsoft.clarity.models.LogLevel;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

public class load extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_load);

        // 注册 WorkManager 定时任务（15 分钟执行一次）
        startNotificationWorker();

        // 适配系统栏
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // 设置状态栏颜色（适配 Android 5.0+）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#1D1D1F"));
        }

        // 初始化 Clarity（微软用户行为分析）
        initClarity();

        // 设置字体缩放比例
        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale = 1.0f;
        getResources().updateConfiguration(configuration, getResources().getDisplayMetrics());

        // 检查并请求通知权限（仅针对 Android 13 及以上），同意后再加载 WebView
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                // 显示解释性对话框，说明为什么需要通知权限
                new AlertDialog.Builder(this)
                        .setTitle("通知权限请求")
                        .setMessage("P-trd不会无故推送信息，为了避免预警功能失效，请允许应用使用通知权限。")
                        .setPositiveButton("确定", (dialog, which) -> {
                            ActivityCompat.requestPermissions(this,
                                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                                    1001);
                        })
                        .setNegativeButton("取消", (dialog, which) -> {
                            // 用户拒绝权限时可选择退出或其他处理方式
                            finish();
                        })
                        .show();
            } else {
                // 如果已经授权，则加载 WebView
                setupWebView();
            }
        } else {
            // Android 13 以下系统无需请求通知权限，直接加载 WebView
            setupWebView();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == 1001) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 用户同意通知权限后加载 WebView
                setupWebView();
            } else {
                // 用户拒绝通知权限，可选择退出或提示用户
                finish();
            }
        } else {
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    private void setupWebView() {
        webView = findViewById(R.id.webview);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings webSettings = webView.getSettings();
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setUseWideViewPort(true);

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        webView.setWebViewClient(new WebViewClient());
        WebView.setWebContentsDebuggingEnabled(true);

        // 绑定 JS 交互接口
        webView.addJavascriptInterface(new request(webView), "Request");
        webView.addJavascriptInterface(new jump(this), "Jump");
        webView.addJavascriptInterface(new DataBase(this), "DataBase");

        // 加载本地 HTML 文件
        webView.loadUrl("file:///android_asset/load/load.html");
    }

    private void startNotificationWorker() {
        WorkManager workManager = WorkManager.getInstance(this);

        // 先取消旧任务，确保不会因为系统清理而丢失
        workManager.cancelUniqueWork("ntf_worker");

        // 确保 WorkManager 任务持续运行（15 分钟一次）
        PeriodicWorkRequest periodicWork = new PeriodicWorkRequest.Builder(NotificationWorker.class, 15, TimeUnit.MINUTES)
                .build();
        workManager.enqueueUniquePeriodicWork("ntf_worker", ExistingPeriodicWorkPolicy.KEEP, periodicWork);

        // 添加 WorkManager 状态日志，确保任务被正确注册
        workManager.getWorkInfosForUniqueWorkLiveData("ntf_worker").observe(this, workInfos -> {
            if (workInfos != null && !workInfos.isEmpty()) {
                for (WorkInfo workInfo : workInfos) {
                    Log.d("WorkManagerStatus", "任务状态: " + workInfo.getState());
                }
            } else {
                Log.e("WorkManagerStatus", "❌ WorkManager 任务仍未找到");
            }
        });
    }

    private void initClarity() {
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
    }
}
