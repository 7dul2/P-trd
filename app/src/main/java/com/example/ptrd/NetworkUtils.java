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
                    Request requestWithUserAgent = originalRequest.newBuilder()
                            .header("User-Agent", USER_AGENT)
                            .build();
                    return chain.proceed(requestWithUserAgent);
                }
            })
            .build();

    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
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
