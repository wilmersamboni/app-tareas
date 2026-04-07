package com.wilmer2.TaskDashboard

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.facebook.react.bridge.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class CameraModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var pendingPromise: Promise? = null
    private var photoFile: File? = null

    init { reactContext.addActivityEventListener(this) }

    override fun getName() = "CameraModule"

    @ReactMethod
    fun takePhoto(taskId: String, promise: Promise) {
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No activity available")
            return
        }
        pendingPromise = promise
        try {
            val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
            val photoDir = File(reactContext.filesDir, "task_photos").apply { mkdirs() }
            photoFile = File(photoDir, "task_${taskId}_${timeStamp}.jpg")
            val photoURI: Uri = FileProvider.getUriForFile(
                reactContext, "${reactContext.packageName}.fileprovider", photoFile!!)
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            }
            activity.startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)
        } catch (e: Exception) {
            promise.reject("CAMERA_ERROR", e.message)
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != REQUEST_IMAGE_CAPTURE) return
        if (resultCode == Activity.RESULT_OK) {
            val file = photoFile
            if (file != null && file.exists()) {
                val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                BitmapFactory.decodeFile(file.absolutePath, options)
                val result = Arguments.createMap().apply {
                    putString("uri", "file://${file.absolutePath}")
                    putString("fileName", file.name)
                    putInt("width", options.outWidth)
                    putInt("height", options.outHeight)
                    putDouble("size", file.length().toDouble())
                }
                pendingPromise?.resolve(result)
            } else {
                pendingPromise?.reject("NO_FILE", "Photo file not found")
            }
        } else {
            pendingPromise?.resolve(null)
        }
        pendingPromise = null
        photoFile = null
    }

    override fun onNewIntent(intent: Intent) {}

    companion object {
        const val REQUEST_IMAGE_CAPTURE = 1001
    }
}