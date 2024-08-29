package com.example.ptrd;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.MediaType;
import okhttp3.Response;
import okhttp3.Interceptor;
import okhttp3.ResponseBody;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import android.os.Handler;
import android.os.Looper;

public class NetworkUtils {
    // Define the User-Agent string
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0";

    // Create OkHttpClient with User-Agent Interceptor
    private static final OkHttpClient client = new OkHttpClient.Builder()
            .addInterceptor(new Interceptor() {
                @Override
                public Response intercept(Chain chain) throws IOException {
                    Request originalRequest = chain.request();
                    Request.Builder requestBuilder = originalRequest.newBuilder()
                            .header("User-Agent", USER_AGENT);

                    // Check if the host matches specific criteria and add extra headers
                    String host = originalRequest.url().host();
                    if ("api-csob.douyuex.com".equals(host)) {
                        requestBuilder.header("timestamp", "1722125215870");
                        requestBuilder.header("auth", "a75970b8947d00e9aff38802caeb784c");
                    }

                    Request requestWithHeaders = requestBuilder.build();
                    return chain.proceed(requestWithHeaders);
                }
            })
            .build();

    private static final ExecutorService executor = Executors.newCachedThreadPool();
    private static final Handler mainHandler = new Handler(Looper.getMainLooper());

    // MediaType for JSON
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    // Method to send GET request
    public static void fetchData(String url, Callback callback) {
        executor.execute(() -> {
            try {
                Request request = new Request.Builder()
                        .url(url)
                        .build();

                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    mainHandler.post(() -> callback.onSuccess(responseData));
                } else {
                    mainHandler.post(() -> callback.onError(new IOException("Unexpected code " + response)));
                }
            } catch (IOException e) {
                mainHandler.post(() -> callback.onError(e));
            }
        });
    }

    // Method to send POST request
    public static void postData(String url, String json, Callback callback) {
        executor.execute(() -> {
            try {
                RequestBody body = RequestBody.create(json, JSON);
                Request request = new Request.Builder()
                        .url(url)
                        .post(body)
                        .build();

                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    mainHandler.post(() -> callback.onSuccess(responseData));
                } else {
                    mainHandler.post(() -> callback.onError(new IOException("Unexpected code " + response)));
                }
            } catch (IOException e) {
                mainHandler.post(() -> callback.onError(e));
            }
        });
    }

    public interface Callback {
        void onSuccess(String response);
        void onError(Exception e);
    }
}
