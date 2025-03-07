package com.example.ptrd;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class NotificationWorker extends Worker {
    private static final String CHANNEL_ID = "price_channel";
    private static final String API_URL = "https://ptrd.pen-net.cn/api/NTF"; // 服务器 API

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        createNotificationChannel(); // 初始化通知渠道
    }

    @NonNull
    @Override
    public Result doWork() {
        String jsonResponse = fetchNotifications();
        if (jsonResponse != null) {
            parseAndSendNotifications(jsonResponse);
        }
        return Result.success();
    }

    private String fetchNotifications() {
        // 查询 SQLite 数据库，获取 auth 值
        String auth = getAuthValue();

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", auth)  // 将 auth 放入请求头
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                return response.body().string();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    private void parseAndSendNotifications(String jsonResponse) {
        try {
            JSONObject root = new JSONObject(jsonResponse);

            // ✅ 解析 "data" 字段，而不是 "notifications"
            JSONArray notifications = root.optJSONArray("data");

            if (notifications != null) {
                for (int i = 0; i < notifications.length(); i++) {
                    JSONObject obj = notifications.getJSONObject(i);
                    String title = obj.optString("title", "通知");
                    String message = obj.optString("message", "暂无内容");
                    sendNotification(title, message);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void sendNotification(String title, String message) {
        Log.d("NotificationWorker", "正在发送通知: " + title + " - " + message);

        NotificationManager manager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) {
            Log.e("NotificationWorker", "❌ NotificationManager 为空，无法发送通知");
            return;
        }

        new Handler(Looper.getMainLooper()).post(() -> {
            Intent intent = new Intent(getApplicationContext(), index.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    getApplicationContext(),
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setContentIntent(pendingIntent) // 添加点击跳转功能
                    .setAutoCancel(true);

            manager.notify((int) System.currentTimeMillis(), builder.build());
            Log.d("NotificationWorker", "✅ 通知已成功显示: " + title);
        });
    }


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null) {
                Log.e("NotificationWorker", "❌ 无法创建 NotificationChannel，NotificationManager 为空");
                return;
            }

            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "通知提醒",
                    NotificationManager.IMPORTANCE_HIGH // ✅ 确保重要级别足够高
            );
            channel.setDescription("用于提醒用户新消息");
            manager.createNotificationChannel(channel);
            Log.d("NotificationWorker", "✅ NotificationChannel 创建成功");
        }
    }

    private String getAuthValue() {
        String auth = "";
        SQLiteDatabase db = null;
        Cursor cursor = null;
        try {
            // 假设你有一个 DBHelper 用于管理数据库
            DatabaseHelper dbHelper = new DatabaseHelper(getApplicationContext());
            db = dbHelper.getReadableDatabase();
            cursor = db.rawQuery("SELECT value FROM config WHERE name = ?", new String[]{"auth"});
            if (cursor != null && cursor.moveToFirst()) {
                auth = cursor.getString(0);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (cursor != null) {
                cursor.close();
            }
            if (db != null) {
                db.close();
            }
        }
        return auth;
    }


}
