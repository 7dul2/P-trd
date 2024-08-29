package com.example.ptrd;


import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
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
        SQLiteDatabase db = null;
        Cursor cursor = null;
        StringBuilder result = new StringBuilder();

        try {
            db = dbHelper.getReadableDatabase();  // 获取数据库实例
            cursor = db.rawQuery(sql, args);  // 执行查询

            if (cursor != null && cursor.getCount() > 0) {  // 检查 cursor 是否非空且包含数据
                int columnCount = cursor.getColumnCount();  // 获取列数

                if (columnCount == 1) {
                    // 只有一列的情况下，返回原格式
                    while (cursor.moveToNext()) {
                        result.append(cursor.getString(0)).append("\n");
                    }
                } else {
                    // 多列的情况下，格式化输出
                    while (cursor.moveToNext()) {
                        for (int i = 0; i < columnCount; i++) {
                            result.append(cursor.getString(i));  // 读取每一列的值
                            if (i < columnCount - 1) {
                                result.append(", ");  // 用逗号分隔列值
                            }
                        }
                        result.append("\n");  // 每行数据以换行符结束
                    }
                }
            } else {
                Log.d("DatabaseHelper", "查询没有返回任何结果。");
            }
        } catch (Exception e) {
            Log.e("DatabaseHelper", "查询时发生错误: " + e.getMessage(), e);
        } finally {
            if (cursor != null) {
                cursor.close();  // 确保 cursor 在不使用时关闭
            }
            if (db != null) {
                db.close();  // 确保数据库在不使用时关闭
            }
        }

        return result.toString();
    }
}
