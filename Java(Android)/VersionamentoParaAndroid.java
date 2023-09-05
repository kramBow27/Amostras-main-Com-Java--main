  import static android.content.Context.POWER_SERVICE;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import java.util.ArrayList;
import java.util.Objects;
  
  public static boolean permissaoAndroid(Context context) {

        int PERMISSION_ALL = 0;

        String[] PERMISSIONS = {Manifest.permission.CAMERA, Manifest.permission.READ_PHONE_STATE, Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.WRITE_EXTERNAL_STORAGE};
        String[] MEDIA_PERMISSIONS = {Manifest.permission.CAMERA, Manifest.permission.READ_PHONE_STATE, Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.READ_MEDIA_AUDIO, Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_MEDIA_VIDEO};

          //Alteração para versão android 13 API 33
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {


            Intent intent = new Intent();
            assert context != null;
            String packageName = context.getPackageName();
            PowerManager pm = (PowerManager) context.getSystemService(POWER_SERVICE);

            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                context.startActivity(intent);
                return false;
            }
            for (String permission : MEDIA_PERMISSIONS) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions((Activity) context, MEDIA_PERMISSIONS, PERMISSION_ALL);
                }
            }
            return true;
        }

        // A partir do Android 11 (R) - Api 30 - Permissão de acesso a todos os arquivos.
     if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {

            if (!Environment.isExternalStorageManager()) {
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                Uri uri = Uri.fromParts("package", context.getPackageName(), null);
                intent.setData(uri);
                context.startActivity(intent);
                return false;
            }
        }

        // A partir do Android 8 (Oreo) - Api 26 - Permissão para instalar apps desconhecidos
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            if (!Objects.requireNonNull(context).getPackageManager().canRequestPackageInstalls()) {
                ((Activity) context).startActivityForResult(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES).setData(Uri.parse(String.format("package:%s", context.getPackageName()))), 1234);
                return false;
            }
        }

        // Permissão para que o aplicativo sempre execute em segundo plano.
        Intent intent = new Intent();
        assert context != null;
        String packageName = context.getPackageName();
        PowerManager pm = (PowerManager) context.getSystemService(POWER_SERVICE);

        if (!pm.isIgnoringBatteryOptimizations(packageName)) {
            intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + packageName));
            context.startActivity(intent);
            return false;
        }

        for (String permission : PERMISSIONS) {
            if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions((Activity) context, PERMISSIONS, PERMISSION_ALL);
                return false;
            }
        }
        
        return true;
    }