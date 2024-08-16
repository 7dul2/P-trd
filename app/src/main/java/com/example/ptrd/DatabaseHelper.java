package com.example.ptrd;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "p_trd.db";
    private static final int DATABASE_VERSION = 1;

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_TABLE = "CREATE TABLE stars (id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT UNIQUE)";
        db.execSQL(CREATE_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS favorites");
        onCreate(db);
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