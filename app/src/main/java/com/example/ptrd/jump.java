package com.example.ptrd;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;

public class jump {
    private Context mContext;

    public jump(Context context) {
        mContext = context;
    }

    @JavascriptInterface
    public void jump(String page, String data) {
        Intent intent;
        switch (page) {
            case "init_load":
                intent = new Intent(mContext, MainActivity.class);
                break;
            case "index":
                intent = new Intent(mContext, index.class);
                break;
            case "item":
                intent = new Intent(mContext, item.class);
                intent.putExtra("item_name", data); // 将第二个参数传递给activity
                break;
            case "rank":
                intent = new Intent(mContext, rank.class);
                intent.putExtra("rank_name", data); // 将第二个参数传递给activity
                break;
            case "search":
                intent = new Intent(mContext, search.class);
                break;
            default:
                intent = new Intent(mContext, index.class);
                break;
        }
        mContext.startActivity(intent);
    }
}

