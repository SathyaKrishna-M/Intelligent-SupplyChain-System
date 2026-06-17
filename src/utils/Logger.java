package utils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger {
    private static final String LOG_FILE = "logs/application.log";
    private static final String AUDIT_FILE = "logs/audit.log";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    static {
        java.io.File logDir = new java.io.File("logs");
        if (!logDir.exists()) {
            logDir.mkdirs();
        }
    }

    private static void log(String level, String message) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logEntry = String.format("[%s] [%s] %s", timestamp, level, message);
        
        System.out.println(logEntry);
        
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(LOG_FILE, true))) {
            bw.write(logEntry);
            bw.newLine();
        } catch (IOException e) {
            System.err.println("Failed to write to log file: " + e.getMessage());
        }
    }

    public static void info(String message) {
        log("INFO", message);
    }

    public static void warn(String message) {
        log("WARN", message);
    }

    public static void error(String message) {
        log("ERROR", message);
    }

    public static void audit(String action, String message) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logEntry = String.format("[%s] [%s] %s", timestamp, action, message);
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(AUDIT_FILE, true))) {
            bw.write(logEntry);
            bw.newLine();
        } catch (IOException e) {
            System.err.println("Failed to write to audit log file: " + e.getMessage());
        }
    }

    public static java.util.List<String> getRecentAuditLogs() {
        java.util.List<String> logs = new java.util.ArrayList<>();
        try {
            java.io.File file = new java.io.File(AUDIT_FILE);
            if (!file.exists()) return logs;
            
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.FileReader(file))) {
                String line;
                while ((line = br.readLine()) != null) {
                    logs.add(line);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Return last 20 logs in reverse order
        java.util.Collections.reverse(logs);
        if (logs.size() > 20) {
            return logs.subList(0, 20);
        }
        return logs;
    }
}
