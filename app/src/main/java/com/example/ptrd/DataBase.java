package com.example.ptrd;


import android.content.Context;
import android.database.Cursor;
import android.webkit.JavascriptInterface;

public class DataBase {
    private DatabaseHelper dbHelper;

    DataBase(Context context) {
        dbHelper = new DatabaseHelper(context);
    }

    @JavascriptInterface
    public void executeSQL(String sql, String[] args) {
        dbHelper.executeSQL(sql, args);
    }

    @JavascriptInterface
    public String query(String sql, String[] args) {
        Cursor cursor = dbHelper.query(sql, args);
        StringBuilder result = new StringBuilder();
        while (cursor.moveToNext()) {
            result.append(cursor.getString(0)).append("\n");
        }
        cursor.close();
        return result.toString();
    }
}
