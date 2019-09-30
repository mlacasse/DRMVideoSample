package tv.youi;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.view.accessibility.AccessibilityManager;

import android.content.Context;
import android.util.Log;

import java.util.List;

public class AccessibilityInfoModule {
    private static final String TAG = "AccessibilityInfoModule";

    static public boolean _audible(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);

            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_AUDIBLE);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_audible: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_audible: " + result);

        return result;
    }

    static public boolean _generic(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);

            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_generic: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_generic: " + result);

        return result;
    }

    static public boolean _haptic(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);

            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_HAPTIC);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_haptic: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_haptic: " + result);

        return result;
    }

    static public boolean _spoken(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_SPOKEN);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_spoken: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_spoken: " + result);

        return result;
    }

    static public boolean _visual(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);

            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_VISUAL);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_visual: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_visual: " + result);

        return result;
    }

    static public boolean _braille(Context context) {
        boolean result = false;

        try {
            AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);

            if (manager != null) {
                List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_BRAILLE);
                result = !serviceList.isEmpty();
            }
        } catch (Exception e) {
            Log.e(TAG, "_braille: " + e.getLocalizedMessage());
        }

        Log.d(TAG, "_braille: " + result);

        return result;
    }
}
