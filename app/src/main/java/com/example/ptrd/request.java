package com.example.ptrd;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class request {
    private static final String TAG = "Request1";
    private WebView webView;
    private Handler mainHandler;

    public request(WebView webView) {
        this.webView = webView;
        mainHandler = new Handler(Looper.getMainLooper());
    }

    @JavascriptInterface
    public void get(String url, String key, String callback) {
        NetworkUtils.fetchData(url, new NetworkUtils.Callback() {
            @Override
            public void onSuccess(String response) {

                mainHandler.post(() -> {
                    String jsCallback = "javascript:" + callback + "('" + key + "'," + "`" + response + "`)";
                    webView.evaluateJavascript(jsCallback, null);
                });
//                sendDataToServer(url, response,"");
            }

            @Override
            public void onError(Exception e) {
                mainHandler.post(() -> {
                    String errorResponse = "Error: " + e.getMessage();
                    String jsCallback = "javascript:" + callback + "('err',`" + errorResponse + "`)";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }
        });
    }

    @JavascriptInterface
    public void post(String url, String jsonArray,String key,  String callback) {
        NetworkUtils.postData(url, jsonArray, new NetworkUtils.Callback() {
            @Override
            public void onSuccess(String response) {

                mainHandler.post(() -> {
                    String jsCallback = "javascript:" + callback + "('" + key + "'," + "`" + response + "`)";
                    webView.evaluateJavascript(jsCallback, null);

                });
//                sendDataToServer(url, response,jsonArray);
            }

            @Override
            public void onError(Exception e) {
                mainHandler.post(() -> {
                    String errorResponse = "Error: " + e.getMessage();
                    String jsCallback = "javascript:" + callback + "('" + errorResponse + "')";
                    webView.evaluateJavascript(jsCallback, null);
                });
            }
        });
    }

    private void sendDataToServer(String requestUrl, String response,String post_header) {
        // 获取当前时间戳
        long timestamp = System.currentTimeMillis() / 1000;

        // 创建数据字典
        JSONObject data = new JSONObject();
        try {
            data.put("timestamp", timestamp);
            data.put("url", requestUrl);

            // 尝试将 response 转换为 JSONArray
            try {
                JSONArray jsonArray = new JSONArray(response);
                data.put("datas", jsonArray);
            } catch (JSONException e) {
                // 如果转换失败，说明 response 不是一个 JSONArray，而是 JSONObject
                JSONObject jsonObject = new JSONObject(response);
                data.put("datas", jsonObject);
            }

            if (post_header!= ""){
                try {
                    JSONArray jsonArray = new JSONArray(post_header);
                    data.put("header", jsonArray);
                } catch (JSONException e) {
                    JSONObject jsonObject = new JSONObject(post_header);
                    data.put("header", jsonObject);
                }
            }

            Log.d(TAG, "Data to send: " + data.toString());
        } catch (JSONException e) {
            Log.e(TAG, "Failed to create JSON data", e);
            return;
        }

        // 将数据发送到指定服务器
        String serverUrl = "http://124.70.178.24:54321/rcv_datas";
        NetworkUtils.postData(serverUrl, data.toString(), new NetworkUtils.Callback() {
            @Override
            public void onSuccess(String response) {
                Log.d(TAG, "Data successfully sent to server, Response: " + response);
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "Failed to send data to server", e);
            }
        });
    }
}
