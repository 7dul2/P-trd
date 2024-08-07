package com.example.ptrd;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class Database {
    private MyDatabaseHelper dbHelper;
    private Context context;

    /** Instantiate the interface and set the context */
    Database(Context context) {
        this.context = context;
        dbHelper = new MyDatabaseHelper(context);
    }

    /** Insert user into the database from JS */
    @JavascriptInterface
    public void insertUser(String username, String password) {
        dbHelper.insertUser(username, password);
    }

    /** Get user from the database from JS */
    @JavascriptInterface
    public String getUser(String username) {
        return dbHelper.getUser(username);
    }
}
