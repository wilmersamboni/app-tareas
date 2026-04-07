package com.wilmer2.TaskDashboard

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.view.View

class AvatarView(context: Context) : View(context) {

    var name: String = ""
        set(value) {
            field = value
            invalidate()
        }

    private val circlePaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        textAlign = Paint.Align.CENTER
    }

    private fun generateColor(name: String): Int {
        var hash = 0
        for (char in name) {
            hash = char.code + ((hash shl 5) - hash)
        }
        val hue = Math.abs(hash) % 360
        return Color.HSVToColor(floatArrayOf(hue.toFloat(), 0.6f, 0.45f))
    }

    private fun getInitials(name: String): String {
        return name.trim()
            .split("\\s+".toRegex())
            .take(2)
            .mapNotNull { it.firstOrNull()?.uppercaseChar() }
            .joinToString("")
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (width == 0 || height == 0) return
        val cx = width / 2f
        val cy = height / 2f
        val radius = minOf(cx, cy)
        circlePaint.color = generateColor(name)
        canvas.drawCircle(cx, cy, radius, circlePaint)
        val initials = getInitials(name)
        textPaint.textSize = radius * 0.76f
        val textY = cy - (textPaint.descent() + textPaint.ascent()) / 2
        canvas.drawText(initials, cx, textY, textPaint)
    }
}