package com.example.ptrd;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Color;
import android.util.Log;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ScanWidgetProvider extends AppWidgetProvider {
    private static final String TAG = "ScanWidgetProvider";
    private final OkHttpClient client = new OkHttpClient();

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        // 这里可以做初始化操作
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(new ComponentName(context, ScanWidgetProvider.class));
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.scan_widget_layout);

        List<String[]> data = getData(context);

        // 设置默认文本
        for (int i = 1; i <= 5; i++) {
            int nameId = context.getResources().getIdentifier("name_" + i, "id", context.getPackageName());
            int sellId = context.getResources().getIdentifier("sell_" + i, "id", context.getPackageName());
            int sellRateId = context.getResources().getIdentifier("sell_rate_" + i, "id", context.getPackageName());
            int buyId = context.getResources().getIdentifier("buy_" + i, "id", context.getPackageName());
            int buyRateId = context.getResources().getIdentifier("buy_rate_" + i, "id", context.getPackageName());

            if (i - 1 < data.size()) {
                String[] item = data.get(i - 1);
                views.setTextViewText(nameId, item[0]);
                views.setTextViewText(sellId, item[1]);
                views.setTextViewText(sellRateId, item[2]);
                views.setTextViewText(buyId, item[3]);
                views.setTextViewText(buyRateId, item[4]);

                try {
                    views.setTextColor(sellRateId, Color.parseColor(item[5]));
                    views.setTextColor(buyRateId, Color.parseColor(item[6]));
                } catch (IllegalArgumentException e) {
                    // 处理颜色解析错误
                    views.setTextColor(sellRateId, Color.GRAY); // 默认颜色
                    views.setTextColor(buyRateId, Color.GRAY); // 默认颜色
                }
            } else {
                // 设为空文本以清除多余的条目
                views.setTextViewText(nameId, "");
                views.setTextViewText(sellId, "");
                views.setTextViewText(sellRateId, "");
                views.setTextViewText(buyId, "");
                views.setTextViewText(buyRateId, "");
            }
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private List<String[]> getData(Context context) {
        DatabaseHelper dbHelper = new DatabaseHelper(context);
        List<String> itemNames = getItemNames(dbHelper);

        Log.d(TAG, "Item names retrieved: " + itemNames);

        if (itemNames.isEmpty()) {
            Log.d(TAG, "No item names found.");
            return Arrays.asList(); // 返回空列表
        }

        List<String[]> datas = new ArrayList<>();
        String url = "https://api-csob.douyuex.com/api/v2/goods/info";
        int maxRequests = 5;
        int requestCount = 0;

        final CountDownLatch latch = new CountDownLatch(Math.min(itemNames.size(), maxRequests));

        for (String itemName : itemNames) {
            if (requestCount >= maxRequests) {
                break;
            }
            JSONObject params = new JSONObject();
            try {
                params.put("goodsName", itemName);
            } catch (JSONException e) {
                e.printStackTrace();
                Log.e(TAG, "Error creating JSON params: " + e.getMessage());
                latch.countDown(); // 无论请求是否成功，都减少计数器
                continue;
            }
            Log.d(TAG, "Sending request for item: " + itemName);

            RequestBody body = RequestBody.create(params.toString(), MediaType.parse("application/json; charset=utf-8"));

            // 添加请求头
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .addHeader("timestamp", "1722125215870")
                    .addHeader("auth", "a75970b8947d00e9aff38802caeb784c")
                    .build();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    e.printStackTrace();
                    Log.e(TAG, "Request error: " + e.getMessage());
                    latch.countDown(); // 请求失败后减少计数器
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    if (!response.isSuccessful()) {
                        Log.e(TAG, "Unexpected code " + response);
                        latch.countDown(); // 请求失败后减少计数器
                        return;
                    }

                    String responseData = response.body().string();
                    Log.d(TAG, "Response received: " + responseData);
                    try {
                        JSONObject jsonResponse = new JSONObject(responseData);
                        JSONObject dataObject = jsonResponse.getJSONObject("data");
                        JSONArray listArray = dataObject.getJSONArray("list");

                        if (listArray.length() > 0) {
                            JSONObject itemData = listArray.getJSONObject(0);
                            int minPrice = itemData.getInt("minPrice");
                            int purchaseMaxPrice = itemData.getInt("purchaseMaxPrice");

                            // 除以 100 并转换为字符串
                            String minPriceStr = String.valueOf(minPrice / 100.0);
                            String purchaseMaxPriceStr = String.valueOf(purchaseMaxPrice / 100.0);

                            Log.d(TAG, "Parsed data - minPrice: " + minPriceStr + ", purchaseMaxPrice: " + purchaseMaxPriceStr);

                            datas.add(new String[]{itemName, minPriceStr, "-", purchaseMaxPriceStr, "-", "#48484B", "#48484B"});
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.e(TAG, "Error parsing JSON response: " + e.getMessage());
                    }
                    latch.countDown(); // 请求成功后减少计数器
                }
            });
            requestCount++;
        }

        // 等待所有请求完成
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
            Log.e(TAG, "Error waiting for requests to complete: " + e.getMessage());
        }

        return datas;
    }

    private List<String> getItemNames(DatabaseHelper dbHelper) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = null;
        List<String> itemNames = new ArrayList<>();
        try {
            cursor = db.rawQuery("SELECT item_name FROM stars", null);
            int columnIndex = cursor.getColumnIndex("item_name");

            if (columnIndex == -1) {
                // 处理列未找到的情况
                throw new RuntimeException("Column 'item_name' not found in the cursor.");
            }

            if (cursor.moveToFirst()) {
                do {
                    itemNames.add(cursor.getString(columnIndex));
                } while (cursor.moveToNext());
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
            db.close();
        }
        return itemNames;
    }
}
