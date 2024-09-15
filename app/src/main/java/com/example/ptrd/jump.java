package com.example.ptrd;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
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
                intent.putExtra("item_name", data);
                break;
            case "rank":
                intent = new Intent(mContext, rank.class);
                intent.putExtra("rank_name", data);
                break;
            case "search":
                intent = new Intent(mContext, search.class);
                break;
            case "web":
                openWebPage(data);
                return; // 直接返回，不执行后面的startActivity
            case "BUFF":  // 尝试通过 URI Scheme 启动网易BUFF，若失败则跳转到商店
                String uriSchemeBuff = String.format("buff://market/goods?app_id=730&type=market/goods&param={\"game\":\"csgo\",\"goods_id\":\""+data+"\"}");
                intent = getUriSchemeIntentOrRedirect(uriSchemeBuff, "com.netease.buff", "market://details?id=com.netease.buff");
                break;
            case "IGXE":  // 通过包名启动IGXE
                String uriSchemeig = String.format("igxeassistant://?app_id=730&product_id="+data+"&share_id=None&detail_flag=7");
                intent = getUriSchemeIntentOrRedirect(uriSchemeig, "cn.igxe", "market://details?id=cn.igxe");
                break;
            case "悠悠有品":  // 通过包名启动悠悠有品
                String uriSchemeuu = String.format("uuandroid://havequality/getIntoPageProductlist&templateId="+data);
                intent = getUriSchemeIntentOrRedirect(uriSchemeuu, "com.uu898.uuhavequality", "market://details?id=com.uu898.uuhavequality");
                break;
            case "C5":  // 通过包名启动C5
                intent = getAppIntentOrRedirect("com.xc.c5lite", "market://details?id=com.xc.c5lite");
                break;
            default:
                intent = new Intent(mContext, index.class);
                break;
        }
        mContext.startActivity(intent);
    }

    private void openWebPage(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        mContext.startActivity(intent);
    }

    // 工具方法：检查是否安装应用，如果未安装则跳转到应用商店
    private Intent getAppIntentOrRedirect(String packageName, String storeUrl) {
        Intent intent = mContext.getPackageManager().getLaunchIntentForPackage(packageName);
        if (intent == null) {
            openWebPage(storeUrl);  // 应用未安装，跳转到商店
        }
        return intent;
    }

    // 工具方法：使用 URI Scheme 打开应用，如果失败则跳转到应用商店
    private Intent getUriSchemeIntentOrRedirect(String uriScheme, String packageName, String storeUrl) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uriScheme));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        // 尝试通过 URI Scheme 打开应用
        try {
            mContext.startActivity(intent);
        } catch (Exception e) {
            // 如果应用未安装或无法处理该 URI Scheme，则跳转到应用商店
            return getAppIntentOrRedirect(packageName, storeUrl);
        }
        return null;  // 如果成功打开 URI Scheme，不再需要返回 intent
    }
}
