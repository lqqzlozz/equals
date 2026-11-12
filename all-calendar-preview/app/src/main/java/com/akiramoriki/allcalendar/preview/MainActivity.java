package com.akiramoriki.allcalendar.preview;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;

public final class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView calendar = new WebView(this);
        calendar.getSettings().setJavaScriptEnabled(true);
        calendar.getSettings().setAllowFileAccess(false);
        calendar.getSettings().setAllowContentAccess(false);
        calendar.getSettings().setBlockNetworkLoads(true);
        setContentView(calendar);
        calendar.loadUrl("file:///android_asset/index.html");
    }
}
