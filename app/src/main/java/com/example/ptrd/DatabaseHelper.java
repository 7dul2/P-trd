package com.example.ptrd;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "p_trd.db";
    private static final int DATABASE_VERSION = 5; // 版本号更新为5

    // 表名
    private static final String TABLE_STARS = "stars";
    private static final String TABLE_USER = "user";
    private static final String TABLE_ITEMS = "items";
    private static final String TABLE_CONFIG = "config"; // 新增 config 表
    private static final String TABLE_RANK = "rank"; // 新增 rank 表

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {

        // 创建 stars 表
        String CREATE_TABLE_STARS = "CREATE TABLE " + TABLE_STARS + " (id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT UNIQUE)";
        db.execSQL(CREATE_TABLE_STARS);

        // 创建 user 表
        String CREATE_TABLE_USER = "CREATE TABLE " + TABLE_USER + " (token TEXT UNIQUE, share TEXT)";
        db.execSQL(CREATE_TABLE_USER);

        // 创建 items 表
        String CREATE_TABLE_ITEMS = "CREATE TABLE " + TABLE_ITEMS + " (item_name TEXT, hash_name TEXT, buff_id TEXT, yyyp_id TEXT)";
        db.execSQL(CREATE_TABLE_ITEMS);

        // 创建 config 表
        String CREATE_TABLE_CONFIG = "CREATE TABLE " + TABLE_CONFIG + " (name TEXT UNIQUE, value TEXT)";
        db.execSQL(CREATE_TABLE_CONFIG);

        // 创建 rank 表
        String CREATE_TABLE_RANK = "CREATE TABLE " + TABLE_RANK + " (name TEXT, params TEXT)";
        db.execSQL(CREATE_TABLE_RANK);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion < 2) {
            // 创建 user 表，添加新的字段 share
            String CREATE_TABLE_USER = "CREATE TABLE " + TABLE_USER + " (token TEXT UNIQUE, share TEXT)";
            db.execSQL(CREATE_TABLE_USER);

            // 创建 items 表
            String CREATE_TABLE_ITEMS = "CREATE TABLE " + TABLE_ITEMS + " (item_name TEXT, hash_name TEXT, buff_id TEXT, yyyp_id TEXT)";
            db.execSQL(CREATE_TABLE_ITEMS);
        }

        if (oldVersion < 3) {
            // 创建 config 表
            String CREATE_TABLE_CONFIG = "CREATE TABLE " + TABLE_CONFIG + " (name TEXT UNIQUE, value TEXT)";
            db.execSQL(CREATE_TABLE_CONFIG);
        }

        if (oldVersion < 4) {
            // 创建 rank 表
            String CREATE_TABLE_RANK = "CREATE TABLE " + TABLE_RANK + " (name TEXT, params TEXT)";
            db.execSQL(CREATE_TABLE_RANK);
        }
    }

    public void executeSQL(String sql, Object[] args) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL(sql, args);
        db.close();
    }

    public Cursor query(String sql, String[] args) {
        SQLiteDatabase db = this.getReadableDatabase();
        return db.rawQuery(sql, args);
    }
}